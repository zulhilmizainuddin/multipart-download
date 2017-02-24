"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FileSegmentation {
    static getSegmentsRange(fileSize, numOfSegments) {
        const segmentSizes = FileSegmentation.getSegmentsSize(fileSize, numOfSegments);
        let startRange = 0;
        const segmentRanges = segmentSizes.map((value, index, array) => {
            const sizes = array.slice(0, index + 1);
            const sum = sizes.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0);
            const range = { start: startRange, end: sum - 1 };
            startRange = sum;
            return range;
        });
        return segmentRanges;
    }
    static getSegmentsSize(fileSize, numOfSegments) {
        const segmentSize = Math.floor(fileSize / numOfSegments);
        const remainder = fileSize % numOfSegments;
        const segmentSizes = new Array(numOfSegments).fill(segmentSize);
        segmentSizes[segmentSizes.length - 1] += remainder;
        return segmentSizes;
    }
}
exports.default = FileSegmentation;
