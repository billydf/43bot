'use strict';

var request = require('request');
var request_as_promised = require('request-promise');

// Represents the various elements used to create HTTP request URIs
// for QnA Maker operations.
// From Publish Page: HOST
// Example: https://YOUR-RESOURCE-NAME.azurewebsites.net/qnamaker
var host = "https://botqna.azurewebsites.net/qnamaker";

// Authorization endpoint key
// From Publish Page
var endpoint_key = "c46bd382-d636-428a-b8bc-35643c51fa1a";

// Management APIs postpend the version to the route
// From Publish Page, value after POST
// Example: /knowledgebases/ZZZ15f8c-d01b-4698-a2de-85b0dbf3358c/generateAnswer
var route = "/knowledgebases/69d508b1-8685-4ea1-a873-faabf45ef75e/generateAnswer";

// JSON format for passing question to service
var question = {'question': 'See User Guide for information on fault code 016-545.','top': 1};

var getanswer = async () => {

    try{
        // Add an utterance
        var options = {
            uri: host + route,
            method: 'POST',
            headers: {
                'Authorization': "EndpointKey " + endpoint_key
            },
            json: true,
            body: question
        };

        var response = await request_as_promised.post(options);

        console.log(response);

    } catch (err){
        console.log(err.statusCode);
        console.log(err.message);
        console.log(err.error);
    }
};

getanswer();