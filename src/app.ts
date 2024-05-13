import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

// A simple dictionary object for demonstration purposes
const dictionary = {
    en: { hello: "A greeting used when meeting someone." },
    fr: { bonjour: "Salutation utilisée lors d'une rencontre." },
    es: { hola: "Un saludo utilizado al conocer gente." }
};

app.post('/ussd', (req: Request, res: Response) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let sess = req.session;

    if (!sess.data) {
        sess.data = { level: 0 };
    }

    let response = '';
    
    switch (sess.data.level) {
        case 0:
            response = 'CON Choose a language:\n1. English\n2. French\n3. Spanish';
            sess.data.level = 1;
            break;
        case 1:
            if (text === '1') {
                sess.data.language = 'en';
            } else if (text === '2') {
                sess.data.language = 'fr';
            } else if (text === '3') {
                sess.data.language = 'es';
            }
            response = 'CON Enter a word:';
            sess.data.level = 2;
            break;
        case 2:
            const lang = sess.data.language || 'en';
            const word = dictionary[lang][text.toLowerCase()];
            response = `END Meaning: ${word || 'Word not found.'}`;
            break;
        default:
            response = 'END Invalid option.';
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

app.listen(port, () => {
    console.log(`USSD service running on port ${port}`);
});
