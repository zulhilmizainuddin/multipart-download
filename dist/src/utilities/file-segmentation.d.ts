import { PartialDownloadRange } from '../models/partial-download';
export default class FileSegmentation {
    static getSegmentsRange(fileSize: number, numOfSegments: number): PartialDownloadRange[];
    private static getSegmentsSize(fileSize, numOfSegments);
}
