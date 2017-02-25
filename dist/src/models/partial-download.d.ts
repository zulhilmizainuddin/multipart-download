/// <reference types="node" />
import events = require('events');
export interface PartialDownloadRange {
    readonly start: number;
    readonly end: number;
}
export default class PartialDownload extends events.EventEmitter {
    start(url: string, range: PartialDownloadRange): PartialDownload;
}
