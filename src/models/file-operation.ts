import events = require('events');
import fs = require('fs');

import {FileSegmentation} from '../utilities/file-segmentation';
import {PathFormatter} from '../utilities/path-formatter';
import {UrlParser} from '../utilities/url-parser';

import {Operation} from "../models/operation";
import {PartialDownload, PartialDownloadRange} from '../models/partial-download';

export class FileOperation implements Operation {

    private readonly emitter: events.EventEmitter = new events.EventEmitter();

    public constructor(private saveDirectory: string, private fileName: string) { }

    public start(url: string, contentLength: number, numOfConnections: number): events.EventEmitter {
        const filePath = this.createFile(url, this.saveDirectory, this.fileName);

        let writeStream: fs.WriteStream;
        let endCounter: number = 0;

        const segmentsRange: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(contentLength, numOfConnections);
        for (let segmentRange of segmentsRange) {

            new PartialDownload()
                .start(url, segmentRange)
                .on('data', (data, offset) => {
                    this.emitter.emit('data', data, offset);

                    writeStream = fs.createWriteStream(filePath, {flags: 'r+', start: offset});
                    writeStream.write(data);
                })
                .on('end', () => {
                    writeStream.end(() => {
                        if (++endCounter === numOfConnections) {
                            this.emitter.emit('end', filePath);
                        }
                    });
                });
        }

        return this.emitter;
    }

    private createFile(url: string, directory: string, fileName: string): string {
        const file: string = fileName ? fileName: UrlParser.getFilename(url);

        const filePath: string = PathFormatter.format(directory, file);

        fs.createWriteStream(filePath).end();

        return filePath;
    }
}