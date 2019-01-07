var request = require("request"); //questo non servirà più
var env = require('node-env-file');
env(__dirname + '/.env');
var controller=require('./Classi/clsControllerS3.js');
var studente=require('./Classi/clsStudente.js');
var carrieraStudente=require('./Classi/clsCarriera.js');
//var rigaLibretto=require('./Classi/clsRigaLibretto.js');

//test libretto
//var libretto=[];
//libretto=controller.getLibretto('286879');
//fine test libretto

//test carrieraStudente
//carrieraStudente=new carrieraStudente(2019,2019,2019,2019,'123','pippo');

//prova del 04/01/2019 clsStudente con logica di creazione e getStudente per ovviare ad asincronicità
var stud=studente.getStudente();

//test del controller 
/*
studente=controller.doLogin();
//dopo login entro nella parte home con anagrafica 
//DA FARE ASINCRONO!!!
carrieraStudente=controller.getCarrieraAnagraficaHome('s260856');

if (controller.doLogout())
{

  console.log('ok');
}
*/
//var studente=require('./Classi/clsStudente.js');
//studente=new studente('dmavnt73d46l424b','valentina','adami','studenti',6,11111, 11111,11111,'{"cdsDes":"GIURISPRUDENZA","cdsId":10094}');

//console.log('nome della classe '+ studente.constructor.name);
/*
var options = { method: 'GET',
  url: "https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/righe/", //libretto  ?filter=adDes%3D%3D'DIRITTO%20COSTITUZIONALE'
  //logout= https://units.esse3.pp.cineca.it/e3rest/api/logout
  //'https://units.esse3.pp.cineca.it/e3rest/api/login', -> login 
  //appelli prenotabili
  //'https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/10094/69/?q=APPELLI_PRENOTABILI',
  //https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/10094/117740/
  // https://units.esse3.pp.cineca.it/e3rest/api/login
  //anagrafica utente tecnico, non per studenti 'https://units.esse3.pp.cineca.it/e3rest/api/anagrafica-service-v1/utenti/506766/
  //righe libretto OK
  //https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/righe/

  //appelli prenotabili collegati alle righe del libretto OK
  //https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/10094/111213/
  //appello di STORIA DEL DIRITTO MEDIEVALE E MODERNO ok
  //https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/10094/117740/5',
  headers: 
   { 
     'cache-control': 'no-cache',
     'Content-Type': 'application/json',
    'Authorization': 'Basic czI2MDg1NjpRM1ZSQUFRUA=='
    },

  json: true }
  


  let rawData = '';
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (response.statusCode==200){
      console.log(Array.isArray(body));
      rigaLibretto=new rigaLibretto(body[0].aaFreqId,body[0].adCod, 
      body[0].adDes,body[0].adsceId, body[0].annoCorso, body[0].chiaveADContestualizzata, 
      body[0].dataFreq,body[0].dataScadIscr,body[0].esito);

    libretto[0]=rigaLibretto;


        //per debug
      rawData=JSON.stringify(body);
      console.log('\n\nQUESTO IL BODY ' +rawData);
  }

       
    });
    */
