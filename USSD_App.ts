import EventEmitter from 'events';
const eventEmitter = new EventEmitter();

const dictionary = {
    english: {
        "hello": 'A common greeting',
        "world": 'The earth, together with all of its countries, peoples, and natural features'
    },
    chichewa: {
        "muli": 'You are',
        "ndili bwino": 'I am fine'
    }
};

const sessions = {};

eventEmitter.on('ussdRequest', (sessionId, input) => {
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
});

function handleLanguageSelection(sessionId, input) {
    const selectedLanguage = input.trim().toLowerCase();
    if (dictionary[selectedLanguage]) {
        sessions[sessionId].selectedLanguage = selectedLanguage;
        sessions[sessionId].state = 'wordInput';
        sendUssdResponse(sessionId, 'Enter a word:');
    } else {
        sendUssdResponse(sessionId, 'Invalid language. Please choose a valid language:');
    }
}

function handleWordInput(sessionId, input) {
    const word = input.trim().toLowerCase();
    const { selectedLanguage } = sessions[sessionId];
    const meaning = dictionary[selectedLanguage][word];
    if (meaning) {
        sendUssdResponse(sessionId, `Meaning of "${word}" in ${selectedLanguage}: ${meaning}`);
    } else {
        sendUssdResponse(sessionId, `Word "${word}" not found in ${selectedLanguage}. Please try another word:`);
    }
}

function sendUssdResponse(sessionId, message) {
    console.log(`Sending USSD response to session ${sessionId}: ${message}`);
}

