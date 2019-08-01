'use strict';

const builder = require('botbuilder');
const restify = require('restify');
const utils = require('./utils.js');
const customVisionService = require('./customVisionService.js');
const customOcrService = require('./customOcrService.js');
const customQnaService = require('./customQnaService.js');
//var azure = require('botbuilder-azure');

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

//setup cosmosDB
// var documentDbOptions = {
//     host: 'https://swsscosmos.documents.azure.com:443/', 
//     masterKey: 'e9IOqXjHURC9Ra8Jm9D9blIpHwmzukTHCLxjo9ixcO81eO2i79pq3HGGEgUpv1Bsf57MDpTOioqUFPURLcewdA==', 
//     database: 'swsscosmos',   
//     collection: 'botdata'
// };

//var docDbClient = new azure.DocumentDbClient(documentDbOptions);
//var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);


// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`${server.name} listening to ${server.url}`);
});


// Listen for messages from users
server.post('/api/messages', connector.listen());
const bot = new builder.UniversalBot(connector);


//var inMemoryStorage = new builder.MemoryBotStorage();

//default dialog
// bot.dialog('/',[
//     function(session) {
//     session.send("welcome to Software and Solution Support ")
//     //builder.Prompt.text(session, "ada yang bisa dibantu ?")
//     //session.beginDialog("Please capture your Multifunction Device")
//     //builder.Prompts.attachment(session, "Please capture your Multifunction device");
//     if(utils.hasImageAttachment(session)){
//         var stream = utils.getImageStreamFromMessage(session.message); 
//         customVisionService.predict(stream)
//             .then(function (response) {
//                 // Convert buffer into string then parse the JSON string to object
//                 var jsonObj = JSON.parse(response.toString('utf8'));
//                 console.log(jsonObj);
//                 var topPrediction = jsonObj["predictions"][0];

//                 // make sure we only get confidence level with 0.80 and above. But you can adjust this depending on your need
//                 if (topPrediction.probability >= 0.80) {
//                     session.send(`Hey, I think this image is a ${topPrediction.tagName}!`);
//                 } else {
//                     session.send('Sorry! I don\'t know what that is :(');
//                 }
//             }).catch(function (error) {
//                 console.log(error);
//                 session.send('Oops, there\'s something wrong with processing the image. Please try again.');
//             });

//     } else {
//         session.send('I did not receive any image');
//     }
// },
// function(session){
//     if(utils.hasImageAttachment(session)){
//         //var stream = utils.getImageStreamFromMessage(session.message); 
//         //var imgurl = utils.url(session.message);
//         //console.log(imgurl);
//         var stream = utils.getImageStreamFromMessage(session.message); 
//         customOcrService.predict(stream)
//             .then(function (response) {
//                 var jsonResponse = JSON.parse(response.toString('utf8'));
//                 //console.log('JSON Response\n');
//                 //console.log(jsonResponse);
//                 var ocr = jsonResponse ["regions"][0];
//                 var lines = ocr ["lines"][3];
//                 console.log(lines);
//                 var txt = lines ["words"][9];
//                 //var word= txt ["text"][2];
//                 //console.log(txt);
//                 session.send(`Error Code is ${lines.words[8].text}`);

//             }).catch(function (error) {
//                 console.log(error);
//                 session.send('Oops, there\'s something wrong with processing the image. Please try again.');
//             });

//     } else {
//         session.send('I did not receive any image');
//     }
// }

// ]);//.set('storage', inMemoryStorage);


bot.dialog('/', function(session){
    if(utils.hasImageAttachment(session)){
        //var stream = utils.getImageStreamFromMessage(session.message); 
        //var imgurl = utils.url(session.message);
        //console.log(imgurl);
        var stream = utils.getImageStreamFromMessage(session.message); 
        customOcrService.predictOcr(stream)
            .then(function (response) {
                var jsonResponse = JSON.parse(response.toString('utf8'));
                //console.log('JSON Response\n');
                //console.log(jsonResponse);
                var ocr = jsonResponse ["regions"][0];
                var lines = ocr ["lines"][3];
                console.log(lines);
                var txt = lines ["words"][9];
                //var word= txt ["text"][2];
                //console.log(txt);
                session.send(`Error Code is ${lines.words[8].text}`);

            }).catch(function (error) {
                console.log(error);
                session.send('Oops, there\'s something wrong with processing the image. Please try again.');
            });

    } else {
        session.send('I did not receive any image');
    }
});

// function(session){
//     //session.dialogData.attachment = results.response;
//     //builder.Prompts.attachment(session, "Please capture your error code in MFD Screen");

//     if(utils.hasImageAttachment(session)){
//         //var stream = utils.getImageStreamFromMessage(session.message); 
//         //var imgurl = utils.url(session.message);
//         //console.log(imgurl);
//         var stream2 = utils.getImageStreamFromMessage(session.message); 
//         customOcrService.predictOcr(stream2)
//             .then(function (response) {
//                 var jsonResponse = JSON.parse(response.toString('utf8'));
//                 //console.log('JSON Response\n');
//                 //console.log(jsonResponse);
//                 var ocr = jsonResponse ["regions"][0];
//                 var lines = ocr ["lines"][3];
//                 console.log(lines);
//                 var txt = lines ["words"][9];
//                 //var word= txt ["text"][2];
//                 //console.log(txt);
//                 session.send(`Error Code is ${lines.words[8].text}`);

//             }).catch(function (error) {
//                 console.log(error);
//                 session.send('Oops, there\'s something wrong with processing the image. Please try again.');
//             });

//     } else {
//         session.send('I did not receive any image');
//     }
// });//.set('storage', inMemoryStorage);


//var inMemoryStorage = new builder.MemoryBotStorage();

// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
// var bot = new builder.UniversalBot(connector, [
//     function(session){
//         session.send("Welcome to Software Solution Support");
//         builder.Prompts.text(session, "If you Have trouble please capture your MFD")
//     },
//     function (session, results) {
//         session.dialogData.trouble= results.response;
//         builder.Prompts.attachment(session, "Please capture your Error");
//         if(utils.hasImageAttachment(session)){
//                 var stream = utils.getImageStreamFromMessage(session.message); 
//                 customVisionService.predict(stream)
//                     .then(function (response) {
//                         // Convert buffer into string then parse the JSON string to object
//                         var jsonObj = JSON.parse(response.toString('utf8'));
//                         console.log(jsonObj);
//                         var topPrediction = jsonObj["predictions"][0];
        
//                         // make sure we only get confidence level with 0.80 and above. But you can adjust this depending on your need
//                         if (topPrediction.probability >= 0.80) {
//                             session.send(`Hey, I think this image is a ${topPrediction.tagName}!`);
//                         } else {
//                             session.send('Sorry! I don\'t know what that is :(');
//                         }
//                     }).catch(function (error) {
//                         console.log(error);
//                         session.send('Oops, there\'s something wrong with processing the image. Please try again.');
//                     });
        
//             } else {
//                 session.send('I did not receive any image');
//             }
//     },
//     function (session, results) {
//         session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
//         builder.Prompts.number(session, "How many people are in your party?");
//     },
//     function (session, results) {
//         session.dialogData.partySize = results.response;
//         builder.Prompts.text(session, "Whose name will this reservation be under?");
//     },
//     function (session, results) {
//         session.dialogData.reservationName = results.response;
        
//         // Process request and display reservation details
//         session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
//         session.endDialog();
//     }
// ]).set('storage', inMemoryStorage); // Register in-memory storage 
