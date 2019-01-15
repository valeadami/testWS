//03/01/2019 
/************ */
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
/*********** */
const request = require('request');
const requestnp=require('request-promise-native');
const querystring = require('querystring');
const parseurl = require('parseurl');
const path = require("path");
const https = require('https');


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
var bot='HEADdemo'; //HEADdemo FarmaInfoBot
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
  postData = querystring.stringify({
    'searchText': 'ciao',
    'user':'',
    'pwd':'',
    'ava':'FarmaInfoBot'
    
  });
  //questo diventerà un modulo con la conessione a PLQ
   const options = {
     //modifica del 12/11/2018 : cambiato porta per supportare HTTPS
     
    hostname: '86.107.98.69', 
    /*port: 8080,*/
    port: 8443,
    rejectUnauthorized: false, 
    path: '/AVA/rest/searchService/search_2?searchText=', 
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json', 
      'Cookie':'' // +avaSession 
    }
  };
  app.get('/login', function(req, res, next) {

    //15/01/2019
    //test del libretto
    controller.getLibretto().then((libretto)=> {
      
      res.setHeader('Content-Type', 'text/html')
      res.write("ecco i dati del libretto, matricola ID = "+ libretto[0].adDes);
      res.end();
      next(); //va qui il next 
      
   }).catch((error) => {
       console.log('Si è verificato errore : ' +error);
       res.json({ 'fulfillmentText': 'non lo so!!!!!!!!!!'});
    
     });


     //14/01/2019 LO COMMENTO  
        //e uso il CONTROLLER
    /*controller.doLogin().then((studente)=> {
      
      res.setHeader('Content-Type', 'text/html')
      res.write("ecco i dati  "+ studente.codFisc);
      res.end();
      next(); //va qui il next 
      
   }).catch((error) => {
       console.log('Si è verificato errore : ' +error);
       res.json({ 'fulfillmentText': 'non lo so!!!!!!!!!!'});
    
     });*/

    }) 
    

     /* prm.mainMio().then((body)=> {
          //ok ora funge così, però questo codice dovrebbe stare nel controller
       
       

       var stud=new studente(body.login);
   

       res.setHeader('Content-Type', 'text/html')
       res.write("ecco i dati  "+ stud.codFisc);
       res.end();
       next(); //va qui il next 
       
    }).catch((error) => {
        console.log('Si è verificato errore : ' +error);
        res.json({ 'fulfillmentText': 'non lo so!!!!!!!!!!'});
     
    });*/

  //});
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
    agent.add(`Ciao, sono l'assistente virtuale dell’Università degli studi di Trieste. Posso aiutarti a prenotare un appello, vedere il tuo libretto, vedere i risultati di un esame. Dì ad esempio elenco esami per ascoltare i dati del tuo libretto `);
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
    intentMap.set('AnyText', callAVANEW); // callAVA anytext AnyText sostituisce 'qualunquetesto'
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
  //provo a modificare 13/01/2019 
  //cmd tolgo cmd
  function doLogin() {
    return new Promise((resolve, reject) => {
      
        //console.log('+++++++++++ sono in doLogin e il comando =' ) ;//+ cmd)
        var strUrlLogin='https://units.esse3.pp.cineca.it/e3rest/api/login';
         var options = { 
          method: 'GET',
          url: strUrlLogin,
          headers: 
              { 
                  'cache-control': 'no-cache',
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic czI2MDg1NjpRM1ZSQUFRUA=='
              },
          json: true 
      };
      let str = '';
     request(options, function (error, response, body) {
      if (error) throw new Error(error);
          
      
          if (response.statusCode==200){
              console.log('HO RISPOSTA DA ESSETRE!')
  
              //per debug
              //var str=JSON.stringify(body);
              str=JSON.stringify(body.user.codFis);
              console.log('\n\nQUESTO IL BODY dello studente con CF ' +str);
              //aggiunta del 13/01/2019
              //agent.add('da doLogin '+ str);
              //resolve(str);
              resolve(str);
             
            // return str;
          } else {
  
              //LOGIN FAILED
          
              console.log('response.statusCode ' + response.statusCode);
              console.log('login failed');
    
          }
      });  //fine request
   });
  } 

  function responseAgent(agent,str) {
    return new Promise((resolve, reject) => {
      agent.add(str)
      resolve(agent);

    });
  } 
  /**** FUNZIONI A SUPPORTO copiate da progetto api */

function scriviSessione(path, strSessione, strValore) {
  
  fs.appendFile(path + strSessione,strValore, function (err) {
    if (err) {
      
      throw err;
    
    } else {
    console.log('DENTRO SCRIVI SESSIONE: SALVATO FILE '+ path + strSessione);
    
    }
     
  });
 
} 

function leggiSessione(path, strSessione){
  var contents='';
  try {
    fs.accessSync(__dirname+ '/sessions/'+ strSessione);
    contents = fs.readFileSync(__dirname+'/sessions/'+ strSessione, 'utf8');
    console.log('DENTRO LEGGI SESSIIONE ' +contents);
  

  }catch (err) {
    if (err.code==='ENOENT')
    console.log('DENTRO LEGGI SESSIONE :il file non esiste...')
   
  }
  return contents;

} 
 // 18/12/2018
 function getComandi(arComandi)
  {

    var comandi=arComandi;
    if (comandi.length>0){
        //prosegui con il parsing
        //caso 1: ho solo un comando, ad esempio lo stop->prosegui con il parsing
        switch (comandi.length){
          case 1:
            comandi=arComandi;
            break;

          case 2:
          //caso 2: ho due comandi, stop e img=path image, quindi devo scomporre comandi[1] 
            var temp=arComandi[1].toString();
            //temp=img=https.....
            //splitto temp in un array con due elementi divisi da uguale
            temp=temp.split("=");
            console.log('valore di temp[1]= ' +temp[1]);
            arComandi[1]=temp[1];
            comandi=arComandi;

            //scompongo arComandi[1]
            break;

          default:
            //
            console.log('sono in default');

        }
       return comandi; //ritorno array come mi serve STOP oppure STOP, PATH img
      
    } else {
      console.log('non ci sono comandi')

      //non ci sono comandi quindi non fare nulla
      return undefined;
    }
   
  } 
//callAva attuale al 10/01/2019
function callAVA(agent) {
  return new Promise((resolve, reject) => {
 
  let strRicerca='';
  let out='';
  let sessionId = agent.sessionId /*.split('/').pop()*/;
  console.log('dentro call ava il mio session id '+sessionId);
  //modifica del 02/12/2018 per bug utf8
  // faccio encoding in utf8-> utf8.encode()
  var str= utf8.encode(agent.parameters.searchText); //req.body.queryResult.parameters.searchText; //req.body.searchText;
  if (str) {
    strRicerca=querystring.escape(str); //02/12/2018: questo rimane, escape della stringa ci vuole cmq!
    options.path+=strRicerca+'&user=&pwd=&ava'+bot;

  }
 
   let data = '';
    let strOutput='';
   /*
    var ss=leggiSessione(__dirname +'/sessions/', sessionId);
    if (ss===''){
      options.headers.Cookie='JSESSIONID=';
      console.log('DENTRO CALL AVA: SESSIONE VUOTA');
    }else {
      options.headers.Cookie='JSESSIONID='+ss;
      console.log('DENTRO CALL AVA:  HO LA SESSIONE + JSESSIONID');
    }
 */
    const req = https.request(options, (res) => {
    //console.log("DENTRO CALL AVA " + sess);  
    console.log('________valore di options.cookie INIZIO ' + options.headers.Cookie);
    console.log(`STATUS DELLA RISPOSTA: ${res.statusCode}`);
    console.log(`HEADERS DELLA RISPOSTA: ${JSON.stringify(res.headers)}`);
    console.log('..............RES HEADER ' + res.headers["set-cookie"] );
  
    if (res.headers["set-cookie"]){
 
      var x = res.headers["set-cookie"].toString();
      var arr=x.split(';')
      var y=arr[0].split('=');
     
    
    
     //scriviSessione(__dirname+'/sessions/',sessionId, y[1]);
    }
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
     console.log(`BODY: ${chunk}`);
     data += chunk;
  
     let c=JSON.parse(data);
            strOutput=c.output[0].output;
          
            strOutput=strOutput.replace(/(<\/p>|<p>|<b>|<\/b>|<br>|<\/br>|<strong>|<\/strong>|<div>|<\/div>|<ul>|<li>|<\/ul>|<\/li>|&nbsp;|)/gi, '');
       
            //resolve(strOutput); <--- OLD
            //18/12/2018  02/01/2019
            let comandi=[];
            comandi=getComandi(c.output[0].commands);
           if (typeof comandi!=='undefined' && comandi.length>=1) {
              console.log('ho almeno un comando, quindi prosegui con l\' azione ' + comandi[0]);
              agent.add(comandi.toString()); // ok, anche comandi[0] va bene
             
             
           } else{
              agent.add('NO');

           }
         
        
          /**********fino qua gestione comandi 18/12/2018  */   
 
          //agent.add(comandi); //NEW
         
          resolve(agent);
           
         
    });
    res.on('end', () => {
      console.log('No more data in response.');
     
          
            options.path='/AVA/rest/searchService/search_2?searchText=';
           
            console.log('valore di options.path FINE ' +  options.path);
 
    });
  });
   req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    strOutput="si è verificato errore " + e.message;
  
  });
   // write data to request body
   req.write(postData);
  req.end();
  });
 }
 

//mia nuova che non funziona 
function callAVANEW(agent) { 
    return new Promise((resolve, reject) => {
  
    let strRicerca='';
    
    let sessionId = agent.sessionId /*.split('/').pop()*/;
    console.log('dentro call ava il mio session id '+sessionId);
//questo lo tengo perchè mi serve per recuperare la stringa dall'agente
    var str= utf8.encode(agent.parameters.searchText); //req.body.queryResult.parameters.searchText; //req.body.searchText;
    if (str) {
      strRicerca=querystring.escape(str); //02/12/2018: questo rimane, escape della stringa ci vuole cmq!
      options.path+=strRicerca+'&user=&pwd=&ava='+bot;
    
      console.log('options.path da passare a plq: '+ options.path);
    }  
    // ************ FUNZIONA ***********
    /*
    var promise1=getPlq(agent,options); 
    var promise2=doLogin();
    
    Promise.all([promise1,promise2]).then(function(values) {
      console.log(values);
      agent.add(values);
      resolve(agent);
      });
    }).catch((error) => {
     
        console.log('errore '+ error);
      
     });  
      *********/
     
     var tmp;
     getPlq(agent, options).then((comandi)=>{
      //se aggiungi più messaggi, torna un fulfillment messages, altrimenti fulfillment-text
       //agent.add('ho il comando da getPLQ');
       if (comandi.length>1){
         
        tmp=comandi.split(',');
        console.log('comandi '+ comandi.toString());

       } else{

        tmp=comandi[0];
        console.log('questo il valore del comando in tmp[0] '+ tmp[0]);
       }
         //fine if
           //-> questo sarà da fare per multi comando
         
          var cmd=tmp[0];
          switch (cmd) {
            case 'getLibretto':
              console.log('sono nel getLibretto');
              controller.getLibretto().then((libretto)=> {
                var strOutput='ecco gli esami ';
                if (Array.isArray(libretto)){
                 
                  for(var i=0; i<libretto.length; i++){
  
                    strOutput+='esame di ' +   libretto[i].adDes+ ', frequentato  nell \'anno ' +libretto[i].aaFreqId +', anno di corso ' +
                    libretto[i].annoCorso + ', pari a  ' +libretto[i].peso + 'crediti';

                  }
                }
                agent.add(strOutput);
                console.log('strOutput '+ strOutput);
                //agent.setContext({ name: 'libretto', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
                resolve(agent);
              }).catch((error) => {
                console.log('Si è verificato errore : ' +error);
                
             
              });
              break;
            case 'STOP':
             //originale FUNGE!!!! 
              /*doLogin().then((str)=>{
                    
                agent.add('...questo è aggiunto dopo essetre= '+ str);
                console.log('ho il comando '+str);
                resolve(agent);
              });
              */

                //15/01/2019 rivisto codice business...come lo integro ora???
                controller.doLogin().then((studente)=> {

                  agent.add('...questo è aggiunto dopo essetre= '+ studente.codFisc + 'matricola ID '+ studente.trattiCarriera[0].matId);
                  console.log('ho lo studente '+studente.codFisc + 'matricola ID '+ studente.trattiCarriera[0].matId);
                  agent.setContext({ name: 'matricola', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
                  resolve(agent);
                  
                 }).catch((error) => {
                   console.log('Si è verificato errore : ' +error);
                   
                
                 });
              //
              break;
            
            default:
              console.log('sono nel getLibretto');
              break;
          } //fine switch
        
      /* agent.add('il comando è '+ tmp[0]);
       resolve(agent);*/
        
       }).catch((error) => {
      
         console.log('errore '+ error);
       
      });  
   });
  
} 

app.listen(process.env.PORT || 3000, function() {
    console.log("App started on port " + process.env.PORT );
  });


    //11/01/2019
    function getPlq(agent, options) { 
        return new Promise((resolve, reject) => {
      
    
        console.log('dentro getPLQ con options path '+ options.path + ', hostname ' + options.hostname);
       
      
        let data = '';
        let strOutput='';
        
        //options.path+=strRicerca+'&user=&pwd=&?ava='+bot;

        
        const req = https.request(options, (res) => {
          //console.log("DENTRO CALL AVA " + sess);  
          console.log('________valore di options.cookie INIZIO ' + options.headers.Cookie);
          console.log(`STATUS DELLA RISPOSTA: ${res.statusCode}`);
          console.log(`HEADERS DELLA RISPOSTA: ${JSON.stringify(res.headers)}`);
          console.log('..............RES HEADER ' + res.headers["set-cookie"] );
        
          if (res.headers["set-cookie"]){
       
            var x = res.headers["set-cookie"].toString();
            var arr=x.split(';')
            var y=arr[0].split('=');
           
          
          
           //scriviSessione(__dirname+'/sessions/',sessionId, y[1]);
          }
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
           console.log(`BODY: ${chunk}`);
           data += chunk;
        
           let c=JSON.parse(data);
                  strOutput=c.output[0].output;
                
                  strOutput=strOutput.replace(/(<\/p>|<p>|<b>|<\/b>|<br>|<\/br>|<strong>|<\/strong>|<div>|<\/div>|<ul>|<li>|<\/ul>|<\/li>|&nbsp;|)/gi, '');
             
                  //resolve(strOutput); <--- OLD
                  //18/12/2018  02/01/2019
                  let comandi=[];
                  comandi=getComandi(c.output[0].commands);
                 if (typeof comandi!=='undefined' && comandi.length>=1) {
                    console.log('ho almeno un comando, quindi prosegui con l\' azione ' + comandi[0]);
                   // agent.add(comandi.toString()); // ok, anche comandi[0] va bene
                   resolve(comandi.toString());
                   
                 } else{
                    //agent.add('NO');
                    comandi=['NO'];
                 }
               
              
                /**********fino qua gestione comandi 18/12/2018  */   
       
                
               //così funziona, resolve(agent);
                resolve(comandi);
                 
               
          });
          res.on('end', () => {
            console.log('No more data in response.');
           
                
                  options.path='/AVA/rest/searchService/search_2?searchText=';
                 
                  console.log('valore di options.path FINE ' +  options.path);
       
          });
        });
         req.on('error', (e) => {
          console.error(`problem with request: ${e.message}`);
          strOutput="si è verificato errore " + e.message;
        
        });
         // write data to request body
         req.write(postData);
        req.end();
        });
      } 