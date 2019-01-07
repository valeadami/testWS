var request = require("request");
var studente=require('./Classi/clsStudente.js');
var userDetails;
// 1) esempio da https://medium.com/dev-bits/writing-neat-asynchronous-node-js-code-with-promises-32ed3a4fd098
function initialize() {
    // Setting URL and headers for request
    var options = {
        url: 'https://api.github.com/users/narenaryan',
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })

}
//rinomino in old perchè testo ora la mia funzione asincrona
function mainOld() {
    
    var stud;
   // var initializePromise = initialize();
   //puoi chiamare la funzione così e va bene lo stesso
    initialize().then(function(body) {
      
       console.log('body '+ body);
       return body;
    }, function(err) {
        console.log(err);
    }).then(function (body){
        // Print the code activity. Prints 110
        stud=new studente(body.login);
        console.log('valore di studente '+ stud.codFisc);
        return stud;
    }).then (function(stud){
        var s=stud.log();
        return s;
    })
   
}

//faccio una nuova versione di main che ritorna una promise, lo chiamo MainMio
function mainMio() {
    return new Promise(function(resolve, reject) {
    var stud;
   // var initializePromise = initialize();
   //puoi chiamare la funzione così e va bene lo stesso
    initialize().then(function(body) {
     
      // console.log('body di inizialize '+ JSON.stringify(body));
       resolve(body); //-----> ritorno questo valore
    }, function(err) {
        console.log(err);
    })
})
}
//qui invoco la mia promise e poi uso il valore di ritorno per testarlo qui in questo file!!!
function test() {
   
   
   
    	// Do async job
        mainMio().then(function(body) {
           
             console.log('body dentro test '+ JSON.stringify(body));
           
          }, function(err) {
              console.log(err);
          })
   
}
//ATTENTION: NON OCCORRE CHE QUESTA FUNZIONA SIA ASINCRONA, MA LA MAIN!!! 
// FUNCTION PER ESSETRE
 function callEsseTre() {
    // Setting URL and headers for request
   var options = { 
        method: 'GET',
        url: 'https://units.esse3.pp.cineca.it/e3rest/api/login',
        headers: 
            { 
            'User-Agent': 'request',
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'Authorization': 'Basic czI2MDg1NjpRM1ZSQUFRUA=='
            },
        json: true 
    }
    // Return new promise 
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                console.log('sono in callEsseTre e questo è il body '+ JSON.stringify(body));
                resolve(body);
            }
        })
    })

}
//test di async callEsseTre
async function main() {
    var data=await callEsseTre();
    return data;

}
//1). mio 
/*
function initialize() {
    // Setting URL and headers for request
    var options = {
        url: 'https://units.esse3.pp.cineca.it/e3rest/api/login',
        headers: {
            'User-Agent': 'request',
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'Authorization': 'Basic czI2MDg1NjpRM1ZSQUFRUA=='
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
    	// Do async job
        request(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                
                resolve(new studente( JSON.parse(body).user.codFis)
                   
                    );
            }
        })
    })

}

function main() {
    var initializePromise = initialize();
    initializePromise.then(function(result) {
       var stu=result;
        
        //userDetails = result;
        //str=userDetails.user.codFis;
       
        console.log("Initialized user details");
        // Use user details from here
        //console.log(userDetails);
       return stu;
    }, function(err) {
        console.log(err);
    })
}

*/

//3).
/*
function getData(url) {
    // Setting URL and headers for request
    var options = {
        url: url,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

var errHandler = function(err) {
    console.log(err);
}

function main() {
    var userProfileURL = "https://api.github.com/users/narenaryan";
    var dataPromise = getData(userProfileURL);
    // Get user details after that get followers from URL
    dataPromise.then(JSON.parse, errHandler)
               .then(function(result) {
                    userDetails = result;
                    // Do one more async operation here
                    var anotherPromise = getData(userDetails.followers_url).then(JSON.parse);
                    return anotherPromise;
                }, errHandler)
                .then(function(data) {
                    console.log(data)
                }, errHandler);
}*/

// 4).
/*
var message = "";

promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        message += "my";
        resolve(message);
    }, 2000)
})

promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        message += " first";
        resolve(message);
    }, 2000)
})

promise3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        message += " promise";
        resolve(message);
    }, 2000)
})

var printResult = (results) => {
    console.log("Results = ", results, "message = ", message)
}

function main() {
    // See the order of promises. Final result will be according to it
    Promise.all([promise1, promise2, promise3]).then(printResult);
    Promise.all([promise2, promise1, promise3]).then(printResult);
    Promise.all([promise3, promise2, promise1]).then(printResult);
    console.log("prova " + message);
}
*/
//main();
//test();
exports.main=main;
//exports.mainMio=mainMio; //perchè se uso Test mi dà errore Cannot read property 'then' of undefined  in quanto Test non torna una promise