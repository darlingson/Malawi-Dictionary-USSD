import smpp from 'smpp';
import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

const server = smpp.createServer({ debug: true }, (session) => {

    console.log('Client connected:', session.sessionId);

    session.on('bind_transceiver', (pdu) => {
        session.send(pdu.response());
        console.log('Transceiver bound');
    });

    session.on('deliver_sm', (pdu) => {
        const ussdRequest = pdu.short_message.message.toString('utf-8').trim();

        eventEmitter.emit('ussdRequest', ussdRequest);
    });

    session.on('unbind', () => {
        console.log('Client unbound:', session.sessionId);
    });

    session.on('close', () => {
        console.log('Client disconnected:', session.sessionId);
    });

    session.on('error', (error) => {
        console.error('SMPP session error:', error);
    });
});

server.listen(2775, 'localhost', () => {
    console.log('SMPP server is listening on port 2775');
});

module.exports = eventEmitter;
