/// <reference path='../node_modules/@types/node/index.d.ts' />
/// <reference path='../node_modules/@types/request/index.d.ts' />

import event = require('events');
import fs = require('fs');
import request = require('request');

interface PartialDownloadArgs {
    readonly start: number;
    readonly end: number;
    readonly location: string;
}

export class PartialDownload extends event.EventEmitter {

    public start(url: string, args: PartialDownloadArgs): void {

       const options = {
                headers: {
                    Range: `bytes=${args.start}-${args.end}`
                }
            };

            request
                .get(url, options)
                .on('error', (err) => {

                })
                .on('response', (response) => {
                    console.log(response.headers);
                })
                .pipe(fs.createWriteStream(`${args.location}\\file.txt`));
    }
}