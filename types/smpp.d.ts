declare module 'smpp' {
    import { EventEmitter } from 'events';

    interface Session {
        on(event: 'bind_transceiver', listener: (pdu: any) => void): this;
        on(event: 'deliver_sm', listener: (pdu: any) => void): this;
        on(event: 'unbind' | 'close', listener: () => void): this;
        on(event: 'error', listener: (error: Error) => void): this;

        send(pdu: any): void;
        sessionId: string;
    }

    interface ServerOptions {
        debug?: boolean; // Add debug option
    }

    interface Server {
        listen(port: number, host: string, callback?: () => void): void;
    }

    function createServer(options?: ServerOptions,listener: (session: Session) => void): Server;

    const smpp: {
        createServer: typeof createServer;
    };

    export = smpp;
}
