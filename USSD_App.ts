import smpp from 'smpp';

const session = smpp.connect({
    url: 'smpp://your_smpp_server_address:port',
});

session.on('connect', () => {
    console.log('Connected to SMPP server');
});

session.on('error', (error) => {
    console.error('SMPP session error:', error);
});

session.on('close', () => {
    console.log('Connection to SMPP server closed');
});

session.on('pdu', (pdu) => {
    if (pdu.command === 'deliver_sm') {
        const sessionId = pdu.source_addr;
        const ussdRequest = pdu.short_message.message.toString('utf-8').trim();
        handleUssdRequest(sessionId, ussdRequest);
    }
});

function handleUssdRequest(sessionId: string | number, input: string) {
    if (!sessions[sessionId]) {
        sessions[sessionId] = { state: 'languageSelection' };
    }

    const session = sessions[sessionId];

    switch (session.state) {
        case 'languageSelection':
            handleLanguageSelection(sessionId, input);
            break;
        case 'wordInput':
            handleWordInput(sessionId, input);
            break;
        default:
            sendUssdResponse(sessionId, 'Invalid state. Please try again.');
            break;
    }
}

function handleLanguageSelection(sessionId: string | number, input: string) {
    const selectedLanguage = input.trim().toLowerCase();
    if (dictionary[selectedLanguage]) {
        sessions[sessionId].selectedLanguage = selectedLanguage;
        sessions[sessionId].state = 'wordInput';
        sendUssdResponse(sessionId, 'Enter a word:');
    } else {
        sendUssdResponse(sessionId, 'Invalid language. Please choose a valid language:');
    }
}

function handleWordInput(sessionId: string | number, input: string) {
    const word = input.trim().toLowerCase();
    const selectedLanguage = sessions[sessionId]?.selectedLanguage;
    const languageDictionary = dictionary[selectedLanguage as keyof typeof dictionary];

    if (languageDictionary) {
        const meaning = languageDictionary[word];
        if (meaning) {
            sendUssdResponse(sessionId, `Meaning of "${word}" in ${selectedLanguage}: ${meaning}`);
        } else {
            sendUssdResponse(sessionId, `Word "${word}" not found in ${selectedLanguage}. Please try another word:`);
        }
    } else {
        sendUssdResponse(sessionId, `Selected language "${selectedLanguage}" is invalid.`);
    }
}

function sendUssdResponse(sessionId: any, message: string) {
    console.log(`Sending USSD response to session ${sessionId}: ${message}`);
    session.deliver_sm({
        source_addr: 'your_source_address',
        destination_addr: sessionId,
        short_message: {
            message: message,
            udh: undefined,
        },
    }, (responsePdu: { command_status: number; }) => {
        console.log('USSD response sent:', responsePdu.command_status === 0 ? 'Success' : 'Failed');
    });
}


const dictionary: Dictionary = {
    english: {
        "hello": 'A common greeting',
        "world": 'The earth, together with all of its countries, peoples, and natural features'
    },
    chichewa: {
        "muli": 'You are',
        "ndili bwino": 'I am fine',
        "muli bwanji": "a greeting, asking a person how they are doing",
    }
};
interface Session {
    state: string;
    selectedLanguage?: string;
}
interface LanguageDictionary {
    [word: string]: string;
}

interface Dictionary {
    [language: string]: LanguageDictionary;
}

const sessions: { [sessionId: string]: Session } = {};
