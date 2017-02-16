/// <reference path='./node_modules/@types/node/index.d.ts' />
/// <reference path='./node_modules/@types/request/index.d.ts' />

import FileSizing from './utilities/file-sizing';
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

    private getFileSegmentsRange(fileSize: number, numOfSegments: number): PartialDownloadRange[] {
        const segmentSizes: number[] = FileSizing.getFileSizes(fileSize, numOfSegments);

        let startRange: number = 0;
        const segmentRanges: PartialDownloadRange[] = segmentSizes.map((value, index, array) => {

            const sizes: number[] = array.slice(0, index + 1);
            const sum: number = sizes.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0);

            const range: PartialDownloadRange = {start: startRange, end: sum - 1};

            startRange = sum;

            return range;
        });

        return segmentRanges;
    }
}

// new ParallelDownload().start('http://speedtest.ftp.otenet.gr/files/test100k.db', 6,  'C:\\Users\\wiseguy\\Documents\\New folder');
