/// <reference path='../node_modules/@types/node/index.d.ts' />

import concat = require('concat-files');

import FileDeleter from '../utilities/file-deleter';
import FileSegmentation from '../utilities/file-segmentation';
import PathFormatter from '../utilities/path-formatter';
import UrlParser from '../utilities/url-parser';
import Validation from '../utilities/validation';

import PartialDownload, {DownloadResult, PartialDownloadRange} from '../models/partial-download';
import PartialRequestQuery from '../models/partial-request-query';

export default class ParallelDownload {
    public start(url: string, numOfDownloader: number, directory: string): void {

        this.validateInputs(url, directory);

        let downloadResults: DownloadResult[] = [];

        new PartialRequestQuery()
            .getMetadata(url)
            .then((metadata) => {
                const segmentsRange: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(metadata.contentLength, numOfDownloader);
                for (let segmentRange of segmentsRange) {
                    const partialDownload: PartialDownload = new PartialDownload();

                    partialDownload.start(url, directory, segmentRange);

                    partialDownload
                        .on('finish', (downloadResult) => {
                            downloadResults.push(downloadResult);

                            if (downloadResults.length === segmentsRange.length) {
                                downloadResults = this.prepareDownloadResults(directory, downloadResults);
                                downloadResults = this.sortDownloadResults(downloadResults);

                                this.concatPartialFiles(url, directory, downloadResults);
                            }
                        })
                        .on('error', (err) => {
                            throw err;
                        });
                }
            })
            .catch((err) => {
                throw err;
            });
    }

    private validateInputs(url: string, directory: string): void {
        if (!Validation.isUrl(url)) {
            throw new Error('Invalid URL provided');
        }

        if (!Validation.isDirectory(directory)) {
            throw new Error('Invalid directory provided');
        }
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

    private concatPartialFiles(url: string, directory: string, downloadResults: DownloadResult[]): void {
        let fileToBeConcatenated: string = UrlParser.getFilename(url);
        fileToBeConcatenated = PathFormatter.format(directory, fileToBeConcatenated);
        
        const downloadedFiles: string[] = downloadResults.map((value, index, array) => {
            return value.filename;
        });

        concat(downloadedFiles, fileToBeConcatenated, (err) => {
            if (err) {
                throw err;
            }

            this.deletePartialFiles(...downloadedFiles)
        });
    }

    private deletePartialFiles(...partialFiles: string[]): void {
        FileDeleter.delete(...partialFiles);
    }
}