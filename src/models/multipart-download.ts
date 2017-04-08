import events = require('events');
import fs = require('fs');

import FileSegmentation from '../utilities/file-segmentation';
import PathFormatter from '../utilities/path-formatter';
import UrlParser from '../utilities/url-parser';
import Validation from '../utilities/validation';

import AcceptRanges from '../models/accept-ranges';
import PartialDownload, {PartialDownloadRange} from '../models/partial-download';
import PartialRequestQuery, {PartialRequestMetadata} from '../models/partial-request-query';

export interface MultipartOperation {
    start(url: string, numOfConnections: number, saveDirectory?: string, filename?: string): MultipartOperation;
}

export default class MultipartDownload extends events.EventEmitter implements MultipartOperation {

    public start(url: string, numOfConnections: number, saveDirectory?: string, filename?: string): MultipartDownload {
        const validationError: Error = this.validateInputs(url, numOfConnections, saveDirectory, filename);
        if (validationError) {
            throw validationError;
        }
        
        new PartialRequestQuery()
            .getMetadata(url)
            .then((metadata) => {

                const metadataError: Error = this.validateMetadata(url, metadata);
                if (metadataError) {
                    throw metadataError;
                }

                if (metadata.acceptRanges !== AcceptRanges.Bytes) {
                    numOfConnections = 1;
                }

                let filePath: string = null;
                if (saveDirectory) {
                    filePath = this.createFile(url, saveDirectory, filename);
                }

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

    private validateMetadata(url: string, metadata: PartialRequestMetadata): Error {
        if (isNaN(metadata.contentLength)) {
            return new Error(`Failed to query Content-Length of ${url}`);
        }

        return null;
    }

    private createFile(url: string, directory: string, filename?: string): string {
        const _filename: string = filename ? filename : UrlParser.getFilename(url);
        const filePath: string = PathFormatter.format(directory, _filename);

        fs.createWriteStream(filePath).end();

        return filePath;
    }
}
