/// <reference path='../node_modules/@types/node/index.d.ts' />
/// <reference path='../node_modules/@types/request/index.d.ts' />

import event = require('events');
import request = require('request');

import UrlParser from '../utilities/url-parser';

export interface PartialDownloadRange {
    readonly start: number;
    readonly end: number;
}

export interface DownloadResult {
    readonly start: number;
    readonly filename: string;
}

export default class PartialDownload extends event.EventEmitter {

    public start(url: string, directory: string, range: PartialDownloadRange): PartialDownload {

        const filename: string = `${UrlParser.getFilename(url)}_${range.start}_${range.end}`;

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
