var projectId = 'botkit-test'; 
var sessionId = 'my-test-session-id';
var languageCode = 'it-IT';

var dialogflowLocale = require('dialogflow');
var sessionClient = new dialogflowLocale.SessionsClient({
  keyFilename: '/Users/admin/Documents/GitHub/Progetto-HEAD/TestWS/botkit-test-7ea2ab19c3d7.json'
  
});
var sessionPath = sessionClient.sessionPath(projectId, sessionId);
/************ */
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
/*********** */
const request = require('request')
const querystring = require('querystring');
const parseurl = require('parseurl');
const path = require("path");
const http = require('http');

/*** DIALOGFLOW FULFILLMENT */
const {WebhookClient} = require('dialogflow-fulfillment');
/*** ACTIONS ON GOOGLE */
const {dialogflow} = require('actions-on-google')
 // Create an app instance
const appDFActions = dialogflow();

/** utilità */
const fs = require("fs");
const utf8=require('utf8');
//file di configurazione
const env = require('node-env-file');
env(__dirname + '/.env');

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

//inizializzo la sessione
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false, maxAge: 180000,name:'JSESSIONID'}
  }));
//uso le variabili di sessione
app.use(function (req, res, next) {
    if (!req.session.views) {
      req.session.views = {}
    }
   
    // get the url pathname
    var pathname = parseurl(req).pathname;
   
    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
    req.session.pippo='pippo';
  
    next();
  })

app.get('/', function(req, res, next) {
    
  
     res.render("index", {  message:" Benvenuto nella pagina di test "});
  
 });
 app.get('/testLocale', function(req, res, next) {
    callAVA('dimmi il libretto');
    res.send('ok')
    //res.render("index", {  message:" Benvenuto nella pagina di test "});
 
});
 app.get('/testSessione', function(req, res, next) {
    if (req.session.views) {
      req.session.views++;
      res.setHeader('Content-Type', 'text/html')
      res.write("sono nella root ");
      res.write('<p>views: ' + req.session.views + '</p>')
      res.write('<p> id sessione ' + req.session.id  +' expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      
      res.end()
    } else {
      req.session.views = 1
      res.end('welcome to the session demo. refresh!')
    }
  })
  /*
 qui ci sarà il codice per gestire app DF con actions


  */

  app.post('/fulfillment', appDFActions);
  
app.listen(process.env.PORT || 3000, function() {
    console.log("App started on port 3000");
  });

//test locale qui
  function callAVA(query) {
    let request = {
      session: sessionPath,
      queryInput: { text: { text: query, languageCode: languageCode } }
    };
    
    sessionClient
    .detectIntent(request)
    .then(responses => {
      console.log('Detected intent');
      console.log(JSON.stringify(responses));
      let result = responses[0].queryResult;
      console.log(' Query: ' + result.queryText);
      //responses[0].queryResult.parameters.fields['geo-city']
      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.parameters.fields)

            //console.log(`  parametri: ${result.parameters.fields['libretto'].stringValue}`);
            console.log('^^^^^^^^^^^oggetti parametro '+ JSON.stringify(result.parameters.fields));
      } else {
        console.log('  No intent matched.');
      }
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}  