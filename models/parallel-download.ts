/// <reference path='../node_modules/@types/node/index.d.ts' />

import fs = require('fs');
import os = require('os');

import FileSegmentation from '../utilities/file-segmentation';
import PathFormatter from '../utilities/path-formatter';
import UrlParser from '../utilities/url-parser';
import Validation from '../utilities/validation';

import PartialDownload, {PartialDownloadRange} from '../models/partial-download';
import PartialRequestQuery from '../models/partial-request-query';

export interface ParallelOperation {
    start(url: string, numOfConnections: number, directory?: string): Promise<string>;
}

export default class ParallelDownload implements ParallelOperation {

    public start(url: string, numOfConnections: number, directory: string = os.tmpdir()): Promise<string> {
        return new Promise((resolve, reject) => {

            const validationError = this.validateInputs(url, numOfConnections, directory);
            if (validationError) {
                reject(validationError);
                return;
            }

            const filePath: string = this.createFile(url, directory);
            
            let writeStream: fs.WriteStream;
            
            new PartialRequestQuery()
                .getMetadata(url)
                .then((metadata) => {
                    const segmentsRange: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(metadata.contentLength, numOfConnections);
                    for (let segmentRange of segmentsRange) {

                        new PartialDownload()
                            .start(url, segmentRange)
                            .on('data', (data, offset) => {
                                writeStream = fs.createWriteStream(filePath, {flags: 'r+', start: offset});
                                writeStream.write(data);
                            })
                            .on('end', () => {
                                writeStream.end();
                            });
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    private validateInputs(url: string, numOfConnections: number, directory: string): Error {
        if (!Validation.isUrl(url)) {
            return new Error('Invalid URL provided');
        }

        if (!Validation.isValidNumberOfConnections(numOfConnections)) {
            return new Error('Invalid number of connections provided');
        }

        if (!Validation.isDirectory(directory)) {
            return new Error('Invalid directory provided');
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