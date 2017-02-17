/// <reference path='./node_modules/@types/node/index.d.ts' />
/// <reference path='./node_modules/@types/request/index.d.ts' />

import concat = require('concat-files');

import FileSegmentation from './utilities/file-segmentation';
import PathFormatter from './utilities/path-formatter';
import UrlParser from './utilities/url-parser';

import PartialDownload, {DownloadResult, PartialDownloadRange} from './models/partial-download';
import PartialRequestQuery from './models/partial-request-query';

export default class ParallelDownload {
    public start(url: string, numOfDownloader: number, directory: string): void {
        const partialRequestQuery: PartialRequestQuery = new PartialRequestQuery();

        let downloadResults: DownloadResult[] = [];

        partialRequestQuery
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
                                downloadResults.sort((x, y) => {
                                    return x.start - y.start;
                                });

                                downloadResults = downloadResults.map((value, index, array) => {
                                    const filenameWithPath: string = PathFormatter.format(directory, value.filename);
                                    const result: DownloadResult = {start: value.start, filename: filenameWithPath};

                                    return result;
                                });

                                let fileToBeConcatenated: string = UrlParser.getFilename(url);
                                fileToBeConcatenated = PathFormatter.format(directory, fileToBeConcatenated);
                                
                                const downloadedFiles: string[] = downloadResults.map((value, index, array) => {
                                    return value.filename;
                                });

                                concat(downloadedFiles, fileToBeConcatenated, (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                });
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
}

// new ParallelDownload().start('http://speedtest.ftp.otenet.gr/files/test100k.db', 6,  'C:\\Users\\wiseguy\\Documents\\New folder');
// new ParallelDownload().start('https://zoompf.com/wp-content/uploads/2010/03/HTTP-Range-Request.png', 5,  'C:\\Users\\wiseguy\\Documents\\New folder');
// new ParallelDownload().start('https://upload.wikimedia.org/wikipedia/commons/b/b8/ESO_Very_Large_Telescope.jpg', 20,  'C:\\Users\\wiseguy\\Documents\\New folder');

