// types/ussdApp.d.ts
declare module 'ussdApp' {
    export type SessionID = string;
    export type Input = string;
    export type Message = string;

    export interface Dictionary {
        [language: string]: {
            [word: string]: string;
        };
    }

    export interface Session {
        sessionId: SessionID;
        selectedLanguage?: string;
        state: 'languageSelection' | 'wordInput';
    }

    export interface Sessions {
        [sessionId: string]: Session;
    }

    export function handleLanguageSelection(sessionId: SessionID, input: Input, sessions: Sessions, dictionary: Dictionary): void;
    export function handleWordInput(sessionId: SessionID, input: Input, sessions: Sessions, dictionary: Dictionary): void;
    export function sendUssdResponse(sessionId: SessionID, message: Message, session: any): void;
}
