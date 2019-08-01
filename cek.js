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

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`${server.name} listening to ${server.url}`);
});


// Listen for messages from users
server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();

// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function(session) {
        session.send("Selamat Datang di layanan Customer Care Astra Graphia");
        builder.Prompts.attachment(session, "=== Silahkan capture Multifunction Device anda yang bermasalah ===") 
    },
    function vision (session, results) {
        if(utils.hasImageAttachment(session)){
            var stream = utils.getImageStreamFromMessage(session.message); 
            customVisionService.predict(stream)
                .then(function (response) {
                    // Convert buffer into string then parse the JSON string to object
                    var jsonObj = JSON.parse(response.toString('utf8'));
                    console.log(jsonObj);
                    var topPrediction = jsonObj["predictions"][0];
    
                    // make sure we only get confidence level with 0.80 and above. But you can adjust this depending on your need
                    if (topPrediction.probability >= 0.80) {
                        var tipe = topPrediction.tagName;
                        session.send(`Tipe Mesin anda adalah ${topPrediction.tagName}!`);
                    } else {
                        session.send('Sorry! I don\'t know what that is :(');
                    }
                }).catch(function (error) {
                    console.log(error);
                    session.send('Oops, there\'s something wrong with processing the image. Please try again.');
                });
    
        } else {
            session.send('I did not receive any image');
        }
        builder.Prompts.attachment(session, "=== Silahkan  upload foto Error Code pada Layar Multifunction Device ===");  
     },

    function ocr (session, results, tipe) {
        session.gettext.tipe = tipe;
        session.dialogData.attachment = results.response;
        
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
                    var eror = lines.words[8].text
                    session.send(`Terdapat Error dengan Kode ${lines.words[8].text}`);
    
                }).catch(function (error) {
                    console.log(error);
                    session.send('Oops, there\'s something wrong with processing the image. Please try again.');
                });
    
        } else {
            session.send('I did not receive any image');
        }
            
        builder.Prompts.text(session, "=== Silahkan Masukan No EQ pada Multifunction Device ===");
    },
    function (session, results, eror) {
        session.gettext.eror = eror;
        session.dialogData.reservationName = results.response;
        
        
        // Process request and display reservation details
        //session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        //session.send(`Complain confirmed. Complain details: <br/> Tipe Mesin: ${session.gettext.tipe} <br/>Jenis Error: ${session.gettext.eror} <br/>EQ Number: ${session.dialogData.reservationName}`);
        //session.send(`Hey, I think this image is a ${topPrediction.tagName}!`);
        //session.send(`Error Code is ${lines.words[8].text}`);
        session.send('=== Terimakasih telah menghubungi Astragraphia, Keluhan anda akan segera kami proses ===');
        
        session.endDialog();
    }
    
    
]).set('storage', inMemoryStorage); // Register in-memory storage