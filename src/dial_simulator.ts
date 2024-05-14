import axios from 'axios';
import { get } from 'http';
const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const serverUrl = 'http://localhost:3000/ussd';
let sessionId = '';
let ussdPrompt = "Dial the USSD code";
const getUserInput =() =>{
    // prompt the user with the contents of the ussdPrompt variable
    console.log("asking for user input");
    rl.question(ussdPrompt, (input:String)=>{

        sendUserInput(input);
    })
    console.log("back in the application loop");
}
const sendUserInput = (input?:String)=>{
    //check if sessionID is empty
    if(!sessionId){
        //then the application is just starting, send the dialed code to the server, and set the sessionID retrieved from the response
        axios.post(serverUrl, {input:input})
        .then((response)=>{
            sessionId = response.data.sessionId;
            ussdPrompt = response.data.ussdPrompt;
            console.log(response.data);
            return
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    else if(sessionId){
        //the session is available, then send the sessionID together with the input to the server
        axios.post(serverUrl, {input:input, sessionId:sessionId})
        .then((response)=>{
            ussdPrompt = response.data.ussdPrompt;
            console.log(response.data);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
}
const applicationLoop = ()=>{
    let running = true;
    while (running){
        getUserInput();
    }
}
getUserInput();