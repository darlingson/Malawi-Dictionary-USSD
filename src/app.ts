import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import session, { Session } from 'express-session';
import Dictionary from './interfaces/dictionary';
import { InteractionMap } from './interfaces/interaction';

interface CustomSession extends Session {
    data?: any;
}

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'darlingson',
    resave: false,
    saveUninitialized: true
}));
let interactions: InteractionMap = {};
function generateInteractionId(): string {
    return Math.random().toString(36).substr(2, 9);
}
const dictionary: Dictionary = {
    en: { hello: "A greeting used when meeting someone." },
    fr: { bonjour: "Salutation utilisée lors d'une rencontre." },
    es: { hola: "Un saludo utilizado al conocer gente." }
};

app.post('/ussd', (req: Request, res: Response) => {
    let { interaction_id } = req.body;

    if (!interaction_id) {
        interaction_id = generateInteractionId();
        interactions[interaction_id] = {
            interaction_level: "0",
            start_time: new Date().toISOString()
        };
    }
    console.log(interaction_id);
    res.send(`Interaction ID: ${interaction_id}`);
});

app.listen(port, () => {
    console.log(`USSD service running on port ${port}`);
});
