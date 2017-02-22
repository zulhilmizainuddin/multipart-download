/// <reference path='../node_modules/@types/chai/index.d.ts' />

import {expect} from 'chai';

import FileSegmentation from '../utilities/file-segmentation';

import {PartialDownloadRange} from '../models/partial-download';

describe('File download segmentation', () => {
    it('is correct size segmentation', () => {
        const downloadRanges: PartialDownloadRange[] = [];
        downloadRanges.push({start: 0, end: 199});
        downloadRanges.push({start: 200, end: 399});
        downloadRanges.push({start: 400, end: 599});
        downloadRanges.push({start: 600, end: 799});
        downloadRanges.push({start: 800, end: 999});

        const result: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(1000, 5);

        expect(result).to.deep.equal(downloadRanges);
    });
});