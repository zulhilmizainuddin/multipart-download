/// <reference path='../node_modules/@types/node/index.d.ts' />
/// <reference path='../node_modules/@types/request/index.d.ts' />

import event = require('events');
import fs = require('fs');
import request = require('request');

import HttpStatus = require('http-status-codes');

import PartialDownloadRange from './partial-download-range';

import PathFormatter from '../utilities/path-formatter';
import UrlParser from '../utilities/url-parser';

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
            .on('response', (response) => {
                if (response.statusCode === HttpStatus.PARTIAL_CONTENT) {
                    // this.emit('done', filename);
                }
            })
            .pipe(fs.createWriteStream(PathFormatter.format(directory, filename)))
            .on('finish', () => {
                this.emit('finish', filename);
            });
    }
}