/// <reference path='../node_modules/@types/node/index.d.ts' />

import concat = require('concat-files');
import os = require('os');

import FileDeleter from '../utilities/file-deleter';
import FileSegmentation from '../utilities/file-segmentation';
import PathFormatter from '../utilities/path-formatter';
import UrlParser from '../utilities/url-parser';
import Validation from '../utilities/validation';

import PartialDownload, {DownloadResult, PartialDownloadRange} from '../models/partial-download';
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

            let downloadResults: DownloadResult[] = [];

            new PartialRequestQuery()
                .getMetadata(url)
                .then((metadata) => {
                    const segmentsRange: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(metadata.contentLength, numOfConnections);
                    for (let segmentRange of segmentsRange) {
                        const partialDownload: PartialDownload = new PartialDownload();

                        partialDownload.start(url, directory, segmentRange);

                        partialDownload
                            .on('finish', (downloadResult) => {
                                downloadResults.push(downloadResult);

                                if (downloadResults.length === segmentsRange.length) {
                                    downloadResults = this.prepareDownloadResults(directory, downloadResults);
                                    downloadResults = this.sortDownloadResults(downloadResults);

                                    this.concatPartialFiles(url, directory, downloadResults, (err, concatenatedFilePath) => {
                                        downloadResults.forEach((value, index, array) => {
                                            this.deletePartialFiles(value.filename);
                                        })

                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(concatenatedFilePath);
                                        }
                                    });
                                }
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

    private prepareDownloadResults(directory: string, downloadResults: DownloadResult[]): DownloadResult[] {
        const preparedResults = downloadResults.map((value, index, array) => {
            const filenameWithPath: string = PathFormatter.format(directory, value.filename);
            const result: DownloadResult = {start: value.start, filename: filenameWithPath};

            return result;
        });

        return preparedResults;
    }

    private sortDownloadResults(downloadResults: DownloadResult[]): DownloadResult[] {
        downloadResults.sort((x, y) => {
            return x.start - y.start;
        });

        return downloadResults;
    }

    private concatPartialFiles(url: string, directory: string, downloadResults: DownloadResult[], callback: (err: Error, concatenatedFilePath: string) => void): void {
        let fileToBeConcatenated: string = UrlParser.getFilename(url);
        fileToBeConcatenated = PathFormatter.format(directory, fileToBeConcatenated);
        
        const downloadedFiles: string[] = downloadResults.map((value, index, array) => {
            return value.filename;
        });

        concat(downloadedFiles, fileToBeConcatenated, (err) => {
            callback(err, fileToBeConcatenated);
        });
    }

    private deletePartialFiles(...partialFiles: string[]): void {
        FileDeleter.delete(...partialFiles);
    }
}