/// <reference path='../node_modules/@types/node/index.d.ts' />
/// <reference path='../node_modules/@types/request/index.d.ts' />

import event = require('events');
import fs = require('fs');
import request = require('request');

import HttpStatus = require('http-status-codes');

import PathFormatter from '../utilities/path-formatter';
import UrlParser from '../utilities/url-parser';

interface PartialDownloadArgs {
    readonly start: number;
    readonly end: number;
}

export default class PartialDownload extends event.EventEmitter {

    public start(url: string, directory: string, args: PartialDownloadArgs): void {

        const filename: string = `${UrlParser.getFilename(url)}_${args.start}_${args.end}`;

        const options: request.CoreOptions = {
                    headers: {
                        Range: `bytes=${args.start}-${args.end}`
                    }
                };

        request
            .get(url, options)
            .on('error', (err) => {
                this.emit('error', filename, args.start, args.end);
            })
            .on('response', (response) => {
                if (response.statusCode === HttpStatus.PARTIAL_CONTENT) {
                    this.emit('done', filename);
                }
            })
            .pipe(fs.createWriteStream(PathFormatter.format(directory, filename)));
    }
}