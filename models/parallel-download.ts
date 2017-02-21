/// <reference path='../node_modules/@types/node/index.d.ts' />

import fs = require('fs');
import events = require('events');
import os = require('os');

import FileSegmentation from '../utilities/file-segmentation';
import PathFormatter from '../utilities/path-formatter';
import UrlParser from '../utilities/url-parser';
import Validation from '../utilities/validation';

import PartialDownload, {PartialDownloadRange} from '../models/partial-download';
import PartialRequestQuery from '../models/partial-request-query';

export interface ParallelOperation {
    start(url: string, numOfConnections: number): ParallelOperation;
}

export default class ParallelDownload extends events.EventEmitter implements ParallelOperation {

    public start(url: string, numOfConnections: number): ParallelDownload {
        const validationError = this.validateInputs(url, numOfConnections);
            if (validationError) {
                throw validationError;
            }

            const directory = os.tmpdir();
            const filePath: string = this.createFile(url, directory);
            
            new PartialRequestQuery()
                .getMetadata(url)
                .then((metadata) => {
                    let endCounter: number = 0;

                    const segmentsRange: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(metadata.contentLength, numOfConnections);
                    for (let segmentRange of segmentsRange) {
                        let writeStream: fs.WriteStream;

                        new PartialDownload()
                            .start(url, segmentRange)
                            .on('data', (data, offset) => {
                                this.emit('data', data, offset);

                                writeStream = fs.createWriteStream(filePath, {flags: 'r+', start: offset});
                                writeStream.write(data);
                            })
                            .on('end', () => {
                                writeStream.end();

                                if (++endCounter === numOfConnections) {
                                    this.emit('end');
                                }
                            });
                    }
                })
                .catch((err) => {
                    throw err;
                });

            return this;
    }

    private validateInputs(url: string, numOfConnections: number): Error {
        if (!Validation.isUrl(url)) {
            return new Error('Invalid URL provided');
        }

        if (!Validation.isValidNumberOfConnections(numOfConnections)) {
            return new Error('Invalid number of connections provided');
        }

        return null;
    }

    private createFile(url: string, directory: string): string {
        const filename: string = UrlParser.getFilename(url);
        const filePath: string = PathFormatter.format(directory, filename);

        fs.createWriteStream(filePath).end();

        return filePath;
    }
}