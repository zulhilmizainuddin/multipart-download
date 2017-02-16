export default class FileSizing {
    public static getFileSizes(fileSize: number, numOfSegments: number): number[] {
        const segmentSize: number = Math.floor(fileSize / numOfSegments);
        const remainder: number = fileSize % numOfSegments;

        const segmentSizes: number[] = new Array(numOfSegments).fill(segmentSize);
        segmentSizes[segmentSizes.length - 1] += remainder;

        return segmentSizes;
    }
}