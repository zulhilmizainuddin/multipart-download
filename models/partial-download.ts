/// <reference path='../node_modules/@types/node/index.d.ts' />
/// <reference path='../node_modules/@types/request/index.d.ts' />

import events = require('events');
import request = require('request');

export interface PartialDownloadRange {
    readonly start: number;
    readonly end: number;
}

export default class PartialDownload extends events.EventEmitter {

    public start(url: string, range: PartialDownloadRange): PartialDownload {

        const options: request.CoreOptions = {
                    headers: {
                        Range: `bytes=${range.start}-${range.end}`
                    }
                };

        let offset: number = range.start;
        request
            .get(url, options)
            .on('error', (err) => {
                throw err;
            })
            .on('data', (data) => {
                this.emit('data', data, offset);
                offset += data.length;
            })
            .on('end', () => {
                this.emit('end');
            });

        return this;
    }
}
