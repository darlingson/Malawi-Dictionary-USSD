import axios from 'axios';
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
interface ServerResponse {
    message: string;
}

const promptUser = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(prompt, (input: string) => {
            resolve(input);
        });
    });
};

const sendUssd = async (input: string) => {
    try {
        const response = await axios.post('http://localhost:3000/ussd', { input: input });
        return response.data; // Assuming this is structured as { message: "Next prompt message" }
    } catch (error) {
        console.error('Error sending USSD:', error);
        return { message: "Error, try again" }; // Return an error prompt to the user
    }
};

const applicationLoop = async () => {
    console.log("Starting the application");
    let prompt = "Enter USSD code: "; // Initial prompt

    let running = true;
    while (running) {
        try {
            const input:string = await promptUser(prompt);
            if (input.toLowerCase() === "exit") {
                running = false;
                console.log("Exiting application.");
                rl.close();
                continue;
            }
            const serverResponse:ServerResponse = await sendUssd(input);
            prompt = serverResponse.message; // Update the prompt based on the server response
            console.log('Server says:', serverResponse.message);
        } catch (error) {
            console.error('An error occurred:', error);
            prompt = "Error, please try again: "; // Reset prompt on error
        }
    }
};

applicationLoop();
