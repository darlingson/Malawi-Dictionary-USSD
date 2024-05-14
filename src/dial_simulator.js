"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var serverUrl = 'http://localhost:3000/ussd';
var sessionId = '';
var ussdPrompt = "Dial the USSD code";
var getUserInput = function () {
    // prompt the user with the contents of the ussdPrompt variable
    console.log("asking for user input");
    rl.question(ussdPrompt, function (input) {
        sendUserInput(input);
    });
    console.log("back in the application loop");
};
var sendUserInput = function (input) {
    //check if sessionID is empty
    if (!sessionId) {
        //then the application is just starting, send the dialed code to the server, and set the sessionID retrieved from the response
        axios_1.default.post(serverUrl, { input: input })
            .then(function (response) {
            sessionId = response.data.sessionId;
            ussdPrompt = response.data.ussdPrompt;
            console.log(response.data);
            return;
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    else if (sessionId) {
        //the session is available, then send the sessionID together with the input to the server
        axios_1.default.post(serverUrl, { input: input, sessionId: sessionId })
            .then(function (response) {
            ussdPrompt = response.data.ussdPrompt;
            console.log(response.data);
        })
            .catch(function (error) {
            console.log(error);
        });
    }
};
var applicationLoop = function () {
    var running = true;
    while (running) {
        getUserInput();
    }
};
getUserInput();
