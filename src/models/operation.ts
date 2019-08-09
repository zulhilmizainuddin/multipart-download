import events = require('events');

export interface Operation {
    start(url: string, contentLength: number, numOfConnections: number): events.EventEmitter;
}
