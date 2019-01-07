var projectId = 'botkit-test'; 
var sessionId = 'my-test-session-id';
var languageCode = 'it-IT';
var respEntity=[];

var dialogflow = require('dialogflow');

const credentials = require('./botkit-test-45d00bf40c15.json');
var sessionClient = new dialogflow.SessionsClient({
  keyFilename: '/Users/admin/Documents/GitHub/Progetto-HEAD/TestWS/botkit-test-7ea2ab19c3d7.json'
  
});
var sessionPath = sessionClient.sessionPath(projectId, sessionId);
//


  // Instantiates clients
  const entityTypesClient = new dialogflow.EntityTypesClient({
    credentials: credentials,
   });
  

  // The path to the agent the entity types belong to.
  const agentPath = entityTypesClient.projectAgentPath(projectId);

  const request = {
    parent: agentPath,
  };

  // Call the client library to retrieve a list of all existing entity types.
  //ottengo tutte le entità collegate all'agente 
  respEntity = entityTypesClient.listEntityTypes(request).then((responses) => {
    // The array of EntityTypes is the 0th element of the response.
      const resources = responses[0];
      for (let i = 0; i < resources.length; i++) {
        const entity = resources[i];
        console.log('entity '+ entity.displayName );
       
      }
      //throw new EntityNotFoundError();
    })
  

//il nome della funzione è indifferente
/*
callAVA('dimmi il libretto');

function callAVA(query) {
  let request = {
    session: sessionPath,
    queryInput: { text: { text: query, languageCode: languageCode } }
  };
  sessionClient
  .detectIntent(request)
  .then(responses => {
    console.log('Detected intent');
    let result = responses[0].queryResult;
    console.log(' Query: ' + result.queryText);
    //responses[0].queryResult.parameters.fields['geo-city']
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      console.log(`  parametri: ${result.parameters.fields['libretto'].stringValue}`);
    } else {
      console.log('  No intent matched.');
    }
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}*/