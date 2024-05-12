declare module 'smpp' {
    import { EventEmitter } from 'events';

    interface PDU {
        command_length: number;
        command_id: string;
        command_status: number;
        sequence_number: number;
        [key: string]: any;
    }

    interface Session extends EventEmitter {
        [x: string]: any;
        send(pdu: PDU, callback?: (pdu: PDU) => void): void;
        connect(options: { url: string }): void;

        on(event: 'bind_transceiver' | 'deliver_sm' | 'unbind' | 'close' | 'error' | 'submit_sm_resp'|'connect'|'pdu', listener: (pdu: PDU) => void): this;

        sessionId?: string;
    }

    interface ServerOptions {
        debug?: boolean;
    }

    interface Server extends EventEmitter {
        listen(port: number, host: string, callback?: () => void): void;
        on(event: 'session', listener: (session: Session) => void): this;
    }

    function createServer(options?: ServerOptions, listener?: (session: Session) => void): Server;

    const smpp: {
        createServer: typeof createServer;
        connect(options: { url: string }): Session;
    };

    export = smpp;
}
