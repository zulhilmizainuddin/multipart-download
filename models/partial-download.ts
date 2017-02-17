/// <reference path='../node_modules/@types/node/index.d.ts' />
/// <reference path='../node_modules/@types/request/index.d.ts' />

import event = require('events');
import fs = require('fs');
import request = require('request');

import HttpStatus = require('http-status-codes');

import PathFormatter from '../utilities/path-formatter';
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

    public start(url: string, directory: string, range: PartialDownloadRange): void {

        const filename: string = `${UrlParser.getFilename(url)}_${range.start}_${range.end}`;

        const options: request.CoreOptions = {
                    headers: {
                        Range: `bytes=${range.start}-${range.end}`
                    }
                };

        request
            .get(url, options)
            .on('error', (err) => {
                this.emit('error', err);
            })
            .pipe(fs.createWriteStream(PathFormatter.format(directory, filename)))
            .on('finish', () => {
                const result: DownloadResult = {start: range.start, filename: filename}
                this.emit('finish', result);
            });
    }
}
