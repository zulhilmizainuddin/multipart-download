import {PartialDownloadRange} from '../models/partial-download';

export class FileSegmentation {
    public static getSegmentsRange(fileSize: number, numOfSegments: number): PartialDownloadRange[]  {
        const segmentSizes: number[] = FileSegmentation.getSegmentsSize(fileSize, numOfSegments);

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

    private static getSegmentsSize(fileSize: number, numOfSegments: number): number[] {
        const segmentSize: number = Math.floor(fileSize / numOfSegments);
        const remainder: number = fileSize % numOfSegments;

        const segmentSizes: number[] = new Array(numOfSegments).fill(segmentSize);
        segmentSizes[segmentSizes.length - 1] += remainder;

        return segmentSizes;
    }
}