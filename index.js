const request = require('request')
var express = require("express");
var bodyParser = require("body-parser");
var parse = require('xml-parser');
const querystring = require('querystring');
var path = require("path");
const https = require('http');
var parseurl = require('parseurl');

var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));


const url = 'https://units.esse3.pp.cineca.it/services/ESSE3WS?WSDL';
var sessioneIDS3='';
var user='';
var pwd='';

//fn_doLogin
//const xmlLogin = "<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.esse3.frk.kion.it'><soapenv:Header/><soapenv:Body><ws:fn_dologin soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'><username xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>s137898</username><password xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>AN4719567</password><sid xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>?</sid></ws:fn_dologin></soapenv:Body></soapenv:Envelope>"
/**************************** */
//fn_doLogout request

//const xmlLogout="<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.esse3.frk.kion.it'>   <soapenv:Header/><soapenv:Body><ws:fn_dologout soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'><sid xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>" + sessioneIDS3+"</sid></ws:fn_dologout></soapenv:Body></soapenv:Envelope>"
/********************* */
//fn_retrievexml
//
//const xml="<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.esse3.frk.kion.it'><soapenv:Header/><soapenv:Body><ws:fn_retrieve_xml soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'><sid xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>2gwcqDbl60PTCnKDWjNo</sid><retrieve xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>CLASSI</retrieve><params xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>?</params><xml xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>?</xml></ws:fn_retrieve_xml></soapenv:Body></soapenv:Envelope>"
/*<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.esse3.frk.kion.it'>   <soapenv:Header/>   <soapenv:Body>      <ws:fn_dologout soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'><sid xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>gpGEOBrhkQqaqITFf0YX</sid></ws:fn_dologout></soapenv:Body></soapenv:Envelope>
*/
/* fn_retrieve_xml request
<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.esse3.frk.kion.it'>   <soapenv:Header/><soapenv:Body><ws:fn_retrieve_xml soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'><sid xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>SESSIONIDGUEST</sid><retrieve xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>TEST</retrieve><params xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>?</params><xml xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>?</xml></ws:fn_retrieve_xml></soapenv:Body></soapenv:Envelope>
 */

 //carriera -serve codice fiscale e sessionid
 //
 //const xml="<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.esse3.frk.kion.it'><soapenv:Header/><soapenv:Body><ws:fn_retrieve_xml soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'><retrieve xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>GET_CV</retrieve><params xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>COD_FISCALE=DMAVNT73D424B;SESSIONID=mANw7hce9EF7d3ofaoDm</params><xml xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>?</xml></ws:fn_retrieve_xml></soapenv:Body></soapenv:Envelope>"

//const xml="<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.esse3.frk.kion.it'><soapenv:Header/><soapenv:Body><ws:fn_retrieve_xml_l soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'><username xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>s260856</username><password xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>Q3VRAAQP</password><retrieve xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>LISTA_APP</retrieve><params xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>mat_id=103598</params><xml xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>?</xml></ws:fn_retrieve_xml_l></soapenv:Body></soapenv:Envelope>"

/*

const opts = {
    body: xml,
    headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'fn_retrieve_xml_l' // fn_dologin fn_doLogout  fn_retrieve_xml

    }
}

const url = 'https://units.esse3.pp.cineca.it/services/ESSE3WS?WSDL';
const body = request.post(url, opts, (err, response) => {
console.log('response', response.body)
})*/

app.get('/', function(req, res, next) {
    
     /* res.setHeader('Content-Type', 'text/html')
      res.write("sono nella root dell'applicativo di test  ");*/
      res.render("index", {  message:" Benvenuto nella pagina di test "});
   
  });


  app.post("/login", function (req,res){

    console.log('Sono nel login ' );
    //console.log(req);
    user=req.body.username; //req.query.username
    pwd=req.body.pwd;
    console.log('username = '+ user + ', password = '+pwd)
    //fn_doLogin
    const xmlLogin = "<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.esse3.frk.kion.it'><soapenv:Header/><soapenv:Body><ws:fn_dologin soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'><username xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>" +user +"</username><password xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>" +pwd+"</password><sid xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>?</sid></ws:fn_dologin></soapenv:Body></soapenv:Envelope>"
    const opts = {
        body: xmlLogin,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'fn_dologin' 
    
        }
    }
    
  
    const body = request.post(url, opts, (err, response) => {
        console.log('response login= ', response.body);
        var obj = parse(response.body);
        console.log(obj.root.children[0].children[0].children[1].content);
        sessioneIDS3=obj.root.children[0].children[0].children[1].content;
        //res.end('hai eseguito il login. Il tuo id di sessione su Esse3 : ' +sessioneIDS3);
        res.render("index", {  message: 'hai eseguito il login. Il tuo id di sessione su Esse3 : ' +sessioneIDS3});
    });
    
   
  });
  
  app.post("/logout", function (req,res){

    console.log('Sono nel logout' );
    const xmlLogout="<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.esse3.frk.kion.it'>   <soapenv:Header/><soapenv:Body><ws:fn_dologout soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'><sid xsi:type='soapenc:string' xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/'>" + sessioneIDS3+"</sid></ws:fn_dologout></soapenv:Body></soapenv:Envelope>"
    const opts = {
        body: xmlLogout,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'fn_doLogout' 
    
        }
    }
    
  
    const body = request.post(url, opts, (err, response) => {
        console.log('response logout= ', response.body)
        //res.end('Hai eseguito logout dalla sessione su Esse3 : ' +sessioneIDS3);
         res.render("index", {  message: 'Hai eseguito logout dalla sessione su Esse3 : ' +sessioneIDS3});
    });
    
   
  });
app.listen(process.env.PORT || 3000, function() {
    console.log("App started on port 3000");
  });