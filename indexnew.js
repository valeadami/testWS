//03/01/2019 
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
//const {dialogflow} = require('actions-on-google')
 // Create an app instance
//const appDFActions = dialogflow();

/** utilità */
const fs = require("fs");
const utf8=require('utf8');
//file di configurazione
const env = require('node-env-file');
env(__dirname + '/.env');
/* classi della logica di business */
var controller=require('./Classi/clsControllerS3.js');
var studente=require('./Classi/clsStudente.js');
var carrieraStudente=require('./Classi/clsCarriera.js');
//test promise
var prm=require('./testPromise.js');


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
    
    req.session.username='';
    req.session.matId='';
    req.session.stuId='';
  
    next();
  })
  app.get('/login', function(req, res, next) {
     
      prm.mainMio().then((body)=> {
          //ok ora funge così, però questo codice dovrebbe stare nel controller
       var stud=new studente(body.login);
       //commento per testare metodi "standard"
     //  res.json({ 'fulfillmentText': stud.codFisc}); 

       res.setHeader('Content-Type', 'text/html')
       res.write("ecco i dati  "+ stud.codFisc);
       res.end();
       next(); //va qui il next 
       
    }).catch((error) => {
        console.log('Si è verificato errore : ' +error);
        res.json({ 'fulfillmentText': 'non lo so!!!!!!!!!!'});
     
    });

  });
  //prova con async/away
  app.get('/loginAA', async function(req, res, next) {
      //esempio tratto da https://medium.com/@iamsamsmith/promises-in-express-js-apis-testing-dd0243163d57
   /* var data = await pullData();
    var filteredData = await filterByYear(data); 
*/
//con promise mia modificata ora commento per testare promise con async
   /* var data=await  prm.mainMio();
    res.json({ 'fulfillmentText':data});*/
    var data=await prm.main();
    res.json({'fulfillmentText':data});
   /*
     res.setHeader('Content-Type', 'text/html')
     res.write("ecco i dati  "+ stud.codFisc);
     res.end();
     next(); //va qui il next 
     */


});
app.get('/', function(req, res, next) {
    
  
     res.render("index", {  message:" Benvenuto nella pagina di test "});
  
 });
 app.get('/testLocale', function(req, res, next) {
  
    res.send('ok')
    //res.render("index", {  message:" Benvenuto nella pagina di test "});
 
});
 app.get('/testSessione', function(req, res, next) {
   
      res.setHeader('Content-Type', 'text/html')
      res.write("sono nella root ");
      res.write('<p>views: ' + req.session.views + '</p>')
      res.write('<p> id sessione ' + req.session.id  +' expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      
      res.end()
  
  })

  /*
 qui ci sarà il codice per gestire app DF con actions

  */
 function welcome (agent) {
    agent.add(`Welcome to Express.JS webhook! `);
    console.log('sono nel welcome');
  }
  
  function fallback (agent) {
    agent.add(`I didn't understand from server`);
   console.log('sono nel fallback');
  }
  function anytext (agent) {
    agent.add(`sono in anytext`);
   console.log('sono in anytext');
  }
 function WebhookProcessing(req, res) {
    const agent = new WebhookClient({request: req, response: res});
    //10/01/2019
    //copiato codice da progetto api
    console.log('------sono su TestWS: ----- la richiesta proviene da '+ agent.requestSource);
    //******************************************* */
    //recupero la sessionId della conversazione
    
    agent.sessionId=req.body.session.split('/').pop();
  //assegno all'agente il parametro di ricerca da invare sotto forma di searchText a Panloquacity
    agent.parameters['searchText']=req.body.queryResult.parameters.searchText;
    console.info(`agent set ` + agent.sessionId +` parameters ` + agent.parameters.searchText);
  
    
    let intentMap = new Map();
    
    intentMap.set('Welcome', welcome); //la funzione callAva sostiutisce la funzione welcome 
    intentMap.set('AnyText', anytext); // AnyText sostituisce 'qualunquetesto'
    intentMap.set('Fallback', fallback); //modifica del 22/11/2018 per gestire la fine della conversazione
    //intentMap.set('CloseConversation', callAVA);
    
    agent.handleRequest(intentMap);
  }
  
  //app.post('/fulfillment', appDFActions);
  app.post("/fulfillment", function (req,res){

    //console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    //console.log('DIALOGFLOW Request body: ' + JSON.stringify(req.body));
    //
    WebhookProcessing(req, res); 
  
  
  });
app.listen(process.env.PORT || 3000, function() {
    console.log("App started on port " + process.env.PORT );
  });

