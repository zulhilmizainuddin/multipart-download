import {Headers} from 'request';

export interface StartOptions {
    numOfConnections?: number;
    writeToBuffer?: boolean;
    saveDirectory?: string;
    fileName?: string;
    headers?: Headers;
}
