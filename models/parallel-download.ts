/// <reference path='../node_modules/@types/node/index.d.ts' />

import events = require('events');
import fs = require('fs');
import os = require('os');

import FileSegmentation from '../utilities/file-segmentation';
import PathFormatter from '../utilities/path-formatter';
import UrlParser from '../utilities/url-parser';
import Validation from '../utilities/validation';

import PartialDownload, {PartialDownloadRange} from '../models/partial-download';
import PartialRequestQuery from '../models/partial-request-query';

export interface ParallelOperation {
    start(url: string, numOfConnections: number, saveDirectory?: string): ParallelOperation;
}

export default class ParallelDownload extends events.EventEmitter implements ParallelOperation {

    public start(url: string, numOfConnections: number, saveDirectory?: string): ParallelDownload {
        const validationError = this.validateInputs(url, numOfConnections, saveDirectory);
        if (validationError) {
            throw validationError;
        }

        let filePath: string = null;
        if (saveDirectory) {
            filePath = this.createFile(url, saveDirectory);
        }
        
        new PartialRequestQuery()
            .getMetadata(url)
            .then((metadata) => {
                let writeStream: fs.WriteStream;
                let endCounter: number = 0;

                const segmentsRange: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(metadata.contentLength, numOfConnections);
                for (let segmentRange of segmentsRange) {

                    new PartialDownload()
                        .start(url, segmentRange)
                        .on('data', (data, offset) => {
                            this.emit('data', data, offset);

                            if (saveDirectory) {
                                writeStream = fs.createWriteStream(filePath, {flags: 'r+', start: offset});
                                writeStream.write(data);
                            }
                        })
                        .on('end', () => {
                            if (saveDirectory) {
                                writeStream.end();
                            }

                            if (++endCounter === numOfConnections) {
                                this.emit('end', filePath);
                            }
                        });
                }
            })
            .catch((err) => {
                throw err;
            });

        return this;
    }

    private validateInputs(url: string, numOfConnections: number, saveDirectory?: string): Error {
        if (!Validation.isUrl(url)) {
            return new Error('Invalid URL provided');
        }

        if (!Validation.isValidNumberOfConnections(numOfConnections)) {
            return new Error('Invalid number of connections provided');
        }

        if (saveDirectory && !Validation.isDirectory(saveDirectory)) {
            return new Error('Invalid save directory provided');
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