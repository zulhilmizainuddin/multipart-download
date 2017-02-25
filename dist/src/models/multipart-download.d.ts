/// <reference types="node" />
import events = require('events');
export interface MultipartOperation {
    start(url: string, numOfConnections: number, saveDirectory?: string): MultipartOperation;
}
export default class MultipartDownload extends events.EventEmitter implements MultipartOperation {
    start(url: string, numOfConnections: number, saveDirectory?: string): MultipartDownload;
    private validateInputs(url, numOfConnections, saveDirectory?);
    private validateMetadata(url, metadata);
    private createFile(url, directory);
}
