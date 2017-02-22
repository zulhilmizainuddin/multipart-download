/// <reference path='../node_modules/@types/chai/index.d.ts' />

import {expect} from 'chai';

import PartialDownload from '../models/partial-download';

describe('Partial download', () => {
    it('download a segment of a file', function(done) {
        this.timeout(5000);

        let segmentSize: number = 0;

        new PartialDownload()
            .start('https://homepages.cae.wisc.edu/~ece533/images/cat.png', {start: 0, end: 199})
            .on('data', (data, offset) => {
                segmentSize += data.length;
            })
            .on('end', () => {
                expect(segmentSize).to.equal(200);
                done();
            });
    });
});