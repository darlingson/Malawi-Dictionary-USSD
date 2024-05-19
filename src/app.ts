import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import Dictionary from './interfaces/dictionary';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

export interface SessionLanguageMap {
    [sessionId: string]: string;
}

const sessionLanguageMap: SessionLanguageMap = {};


const dictionary: Dictionary = {
    en: { hello: "A greeting used when meeting someone." },
    fr: { bonjour: "Salutation utilisée lors d'une rencontre." },
    es: { hola: "Un saludo utilizado al conocer gente." }
};

app.post('/ussd', (req: Request, res: Response) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    console.log(`sessionId: ${sessionId}, serviceCode: ${serviceCode}, phoneNumber: ${phoneNumber}, text: ${text}`);
    
    const session = req.session;
    const inputArray = text.split('*');
    
    if (text === '') {
        const response = `CON 
        Welcome to the Malawi Languages Dictionary.\n
        Select language\n1. English\n2. French\n3. Spanish\n`;
        res.send(response);
    }
    else if (inputArray.length === 1) {
        if (text === '1') {
            sessionLanguageMap[sessionId] = 'en';
            const response = `CON 
            Language: English\n
            Enter the word you want to search\n`;
            res.send(response);
        }
        else if (text === '2') {
            sessionLanguageMap[sessionId] = 'fr';
            const response = `CON
            Language: French\n
            Entrez le mot que vous souhaitez rechercher\n`;
            res.send(response);
        }
        else if (text === '3') {
            sessionLanguageMap[sessionId] = 'es';
            const response = `CON 
            Language: Spanish\n
            Introduzca la palabra que desea buscar\n`;
            res.send(response);
        }
        else {
            res.send('END Invalid choice. Please try again.');
        }
    }
    else if (inputArray.length === 2) {
        const language = sessionLanguageMap[sessionId];
        const word = inputArray[1].toLowerCase();

        if (language && dictionary[language][word]) {
            const response = `END ${language === 'en' ? 'English' : language === 'fr' ? 'French' : 'Spanish'}: ${dictionary[language][word]}`;
            res.send(response);
        }
        else {
            const response = `END Word not found in the selected language.`;
            res.send(response);
        }
    }
    else {
        res.send('END Invalid input.');
    }
});

app.listen(port, () => {
    console.log(`USSD service running on port ${port}`);
});
