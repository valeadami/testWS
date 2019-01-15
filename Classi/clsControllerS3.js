var http = require("https");
var studente=require('./clsStudente.js');
var carriera=require('./clsCarriera.js');
var rigaLibretto=require('./clsRigaLibretto.js');
var request = require("request");
/*   /* console.log(`  Response: ${result.fulfillmentText}`);
    console.log(`  parametri: ${result.parameters['geo-city']}`)*/
//login
var strUrlLogin='https://units.esse3.pp.cineca.it/e3rest/api/login';
//logout
var strUrlLogout='https://units.esse3.pp.cineca.it/e3rest/api/logout'
//anagrafica utente homepage dopo login ->carriere(userId)
var strUrlAnagraficaHome='https://units.esse3.pp.cineca.it/e3rest/api/anagrafica-service-v1/carriere/'; //s260856/
//scelgo link libretto
var strUrlGetLibretto="https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/righe/"; //?filter=adDes%3D%3D'DIRITTO%20COSTITUZIONALE'

//qui ci vorrà user e pwd
function getEsseTreLogin(){
    return new Promise(function(resolve, reject) {
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
    }
   
    request(options, function (error, response, body) {
        if (error) {
            reject(error);
            console.log('errore in doLogin '+ error);
        } else {
            if (response.statusCode==200){
                console.log(body);
                resolve(body); //ritorna una oggetto json
            }  
        }

    });

});

}
function doLogin(){
    return new Promise(function(resolve, reject) {
    getEsseTreLogin().then((body)=>{
      
        studente=new studente(body.user.codFis,body.user.firstName,body.user.lastName,body.user.grpDes,body.user.grpId,body.user.id, body.user.persId,body.user.userId,body.user.trattiCarriera);
        studente.log()
        resolve(studente);

    });
});
}
//riscrivo doLogin con le promise
function doLogout(){

    var blnLogout=false;

    var options = { 
        method: 'GET',
        url: strUrlLogout,
        headers: 
            { 
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                'Authorization': 'Basic czI2MDg1NjpRM1ZSQUFRUA=='
            },
        json: true 
    }
   
    let rawData = '';
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
        if (response.statusCode==200){
            blnLogout=true;
            console.log('\n USCITO DALLA SESSIONE DI ESSETRE');
            studente=undefined;
        }else {

            //LOGIN FAILED
            console.log('response.statusCode ' + response.statusCode);
            console.log('logout failed');
        }
        return blnLogout;
    });
}
//get carriere/userid-> anagrafica utente IN HOMEPAGE
//passo lo username dello studente s260856
function getCarrieraAnagraficaHome(userId){
    var options = { 
        method: 'GET',
        url: strUrlAnagraficaHome +userId +'/', //passo userid dello studente loggato
        headers: 
            { 
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                'Authorization': 'Basic czI2MDg1NjpRM1ZSQUFRUA=='
            },
        json: true 
    }
   
    let rawData = '';
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
        if (response.statusCode==200){
         
            carriera=new carriera(body[0].aaId, body[0].aaImm1, body[0].aaImmSu, body[0].aaOrdId, body[0].aaRegId,
                body[0].cdsCod, body[0].cdsDes, body[0].cdsId, body[0].dataChiusura,body[0].dataImm, body[0].dataImm1, body[0].dataImmSu,
                body[0].matId, body[0].matricola, body[0].motStastuCod, body[0].motStastuDes, body[0].ordCod, body[0].ordDes,body[0].pdsCod,
                body[0].pdsDes,body[0].pdsId, body[0].tipoCorsoCod,body[0].tipoCorsoDes, body[0].tipoTititCod, body[0].tipoTititDes);
            carriera.log();
            //per debug
            rawData=JSON.stringify(body);
            console.log('\n\nQUESTO IL BODY della carriera' +rawData);
        }else {

            //LOGIN FAILED
            console.log('response.statusCode ' + response.statusCode);
            console.log('parametri errati');
        }
        return carriera;
    });


}
//ottieni il libretto-> piano di studi
function getLibretto(matId){
    //array che contiene le righe del libretto
    var libretto=[];
    var options = { 
        method: 'GET',
        url: strUrlGetLibretto,
        headers: 
            { 
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                'Authorization': 'Basic czI2MDg1NjpRM1ZSQUFRUA=='
            },
        json: true 
    }
   
    let rawData = '';
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
        if (response.statusCode==200){
            //controllo che body sia un array
            if (Array.isArray(body)){

                for(var i=0; i<body.length; i++){

                    libretto[i]= new rigaLibretto(body[i].aaFreqId,body[i].adCod, 
                        body[i].adDes,body[i].adsceId, body[i].annoCorso, body[i].chiaveADContestualizzata, 
                        body[i].dataFreq,body[i].dataScadIscr,body[i].esito);

                        libretto[i].log();
                       
                         //libretto[i]=rigaLibretto;


                }

            }
           
            //per debug
            rawData=JSON.stringify(body);
            console.log('\n\nQUESTO IL BODY del libretto ' +rawData);
        }else {

            //LOGIN FAILED
            console.log('response.statusCode ' + response.statusCode);
            console.log('non riesco a leggere il libretto');
        }
        return libretto;
    });

}
exports.doLogin= doLogin;
exports.doLogout = doLogout;
exports.getCarrieraAnagraficaHome=getCarrieraAnagraficaHome;
exports.getLibretto=getLibretto;