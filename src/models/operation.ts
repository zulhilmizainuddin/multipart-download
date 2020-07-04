import events = require('events');
import request = require('request');

export interface Operation {
    start(url: string, contentLength: number, numOfConnections: number, headers?: request.Headers): events.EventEmitter;
}
