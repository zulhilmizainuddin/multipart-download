import events = require('events');
import fs = require('fs');

import FileSegmentation from '../utilities/file-segmentation';
import PathFormatter from '../utilities/path-formatter';
import UrlParser from '../utilities/url-parser';
import Validation from '../utilities/validation';

import AcceptRanges from '../models/accept-ranges';
import PartialDownload, {PartialDownloadRange} from '../models/partial-download';
import PartialRequestQuery, {PartialRequestMetadata} from '../models/partial-request-query';
import {StartOptions} from '../models/start-options';

export interface MultipartOperation {
    start(url: string, options?: StartOptions): MultipartOperation;
    start(url: string, numOfConnections?: number, saveDirectory?: string): MultipartOperation;
}

export default class MultipartDownload extends events.EventEmitter implements MultipartOperation {
    private static readonly DEFAULT_NUMBER_OF_CONNECTIONS: number = 1;
    private static readonly SINGLE_CONNECTION: number = 1;

    public start(url: string, numOfConnectionsOrOptions?: number | StartOptions, saveDirectory?: string): MultipartDownload {
        const options: StartOptions = this.getOptions(numOfConnectionsOrOptions, saveDirectory);

        const validationError: Error = this.validateInputs(url, options);
        if (validationError) {
            throw validationError;
        }

        this.execute(url, options);

        return this;
    }

    private getOptions(numOfConnectionsOrOptions?: number | StartOptions, saveDirectory?: string): StartOptions {
        let connections: number = MultipartDownload.DEFAULT_NUMBER_OF_CONNECTIONS;
        let directory: string;
        let file: string;
        
        if (numOfConnectionsOrOptions) {
            if (typeof numOfConnectionsOrOptions === 'object') {
                connections = numOfConnectionsOrOptions.numOfConnections ?
                                    numOfConnectionsOrOptions.numOfConnections : connections;

                directory = numOfConnectionsOrOptions.saveDirectory;
                file = numOfConnectionsOrOptions.fileName;
            } else {
                connections = numOfConnectionsOrOptions;
                directory = saveDirectory;
                file = null;
            }
        }

        const options: StartOptions = {
            numOfConnections: connections,
            saveDirectory: directory,
            fileName: file
        };

        return options;
    }

    private execute(url: string, options: StartOptions): void {
        new PartialRequestQuery()
            .getMetadata(url)
            .then((metadata) => {

                const metadataError: Error = this.validateMetadata(url, metadata);
                if (metadataError) {
                    throw metadataError;
                }

                if (metadata.acceptRanges !== AcceptRanges.Bytes) {
                    options.numOfConnections = MultipartDownload.SINGLE_CONNECTION;
                }

                let filePath: string = null;
                if (options.saveDirectory) {
                    filePath = this.createFile(url, options.saveDirectory, options.fileName);
                }

                let writeStream: fs.WriteStream;
                let endCounter: number = 0;

                const segmentsRange: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(metadata.contentLength, options.numOfConnections);
                for (let segmentRange of segmentsRange) {

                    new PartialDownload()
                        .start(url, segmentRange)
                        .on('data', (data, offset) => {
                            this.emit('data', data, offset);

                            if (options.saveDirectory) {
                                writeStream = fs.createWriteStream(filePath, {flags: 'r+', start: offset});
                                writeStream.write(data);
                            }
                        })
                        .on('end', () => {
                            const inspectEndCounterAndEmitEndEvent = (): void => {
                                if (++endCounter === options.numOfConnections) {
                                    this.emit('end', filePath);
                                }
                            };

                            if (options.saveDirectory) {
                                writeStream.end(() => {
                                    inspectEndCounterAndEmitEndEvent();
                                });
                            } else {
                                inspectEndCounterAndEmitEndEvent();
                            }
                        });
                }
            })
            .catch((err) => {
                throw err;
            });
    }

    private validateInputs(url: string, options: StartOptions): Error {
        if (!Validation.isUrl(url)) {
            return new Error('Invalid URL provided');
        }

        if (!Validation.isValidNumberOfConnections(options.numOfConnections)) {
            return new Error('Invalid number of connections provided');
        }

        if (options.saveDirectory && !Validation.isDirectory(options.saveDirectory)) {
            return new Error('Invalid save directory provided');
        }

        if (options.fileName && !Validation.isValidFileName(options.fileName)) {
            return new Error('Invalid file name provided');
        }

        return null;
    }

    private validateMetadata(url: string, metadata: PartialRequestMetadata): Error {
        if (isNaN(metadata.contentLength)) {
            return new Error(`Failed to query Content-Length of ${url}`);
        }

        return null;
    }

    private createFile(url: string, directory: string, fileName: string): string {
        const file: string = fileName ? fileName: UrlParser.getFilename(url);

        const filePath: string = PathFormatter.format(directory, file);

        fs.createWriteStream(filePath).end();

        return filePath;
    }
}