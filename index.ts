/// <reference path='./node_modules/@types/node/index.d.ts' />
/// <reference path='./node_modules/@types/request/index.d.ts' />

import FileSegmentation from './utilities/file-segmentation';
import PartialDownload from './models/partial-download';
import PartialDownloadRange from './models/partial-download-range';
import PartialRequestQuery from './models/partial-request-query';

export class ParallelDownload {
    public start(url: string, numOfDownloader: number, directory: string): void {
        const partialRequestQuery: PartialRequestQuery = new PartialRequestQuery();

        partialRequestQuery
            .getMetadata(url)
            .then((metadata) => {
                
            })
            .catch((err) => {

            });
    }
}

// new ParallelDownload().start('http://speedtest.ftp.otenet.gr/files/test100k.db', 6,  'C:\\Users\\wiseguy\\Documents\\New folder');
