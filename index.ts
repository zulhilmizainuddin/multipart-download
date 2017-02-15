/// <reference path='./node_modules/@types/node/index.d.ts' />
/// <reference path='./node_modules/@types/request/index.d.ts' />

import PartialDownload from './models/partial-download';
import PartialRequestQuery from './models/partial-request-query';

export class ParallelDownload {
    public start(url: string, numOfDownloader: number, directory: string): void {
        const partialRequestQuery: PartialRequestQuery = new PartialRequestQuery();

        partialRequestQuery
            .getMetadata(url)
            .then((metadata) => {
                console.log(metadata);
            })
            .catch((err) => {

            });
    }
}

new ParallelDownload().start('http://speedtest.ftp.otenet.gr/files/test100k.db', 5,  'C:\\Users\\wiseguy\\Documents\\New folder');