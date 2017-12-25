import events = require('events');
import fs = require('fs');

import {FileSegmentation} from '../utilities/file-segmentation';
import {PathFormatter} from '../utilities/path-formatter';
import {UrlParser} from '../utilities/url-parser';
import {Validation} from '../utilities/validation';

import {AcceptRanges} from '../models/accept-ranges';
import {DefaultOperation} from '../models/default-operation';
import {FileOperation} from '../models/file-operation';
import {Operation} from "../models/operation";
import {PartialDownload, PartialDownloadRange} from '../models/partial-download';
import {PartialRequestQuery, PartialRequestMetadata} from '../models/partial-request-query';
import {StartOptions} from '../models/start-options';

export interface MultipartOperation {
    start(url: string, options?: StartOptions): MultipartOperation;
    start(url: string, numOfConnections?: number, saveDirectory?: string): MultipartOperation;
}

export class MultipartDownload extends events.EventEmitter implements MultipartOperation {
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

                let operation: Operation;
                if (options.saveDirectory) {
                    operation = new FileOperation(options.saveDirectory, options.fileName);
                } else {
                    operation = new DefaultOperation();
                }

                operation
                    .start(url, metadata.contentLength, options.numOfConnections)
                    .on('data', (data, offset) => {
                        this.emit('data', data, offset);
                    })
                    .on('end', (output) => {
                        this.emit('end', output);
                    });
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
}