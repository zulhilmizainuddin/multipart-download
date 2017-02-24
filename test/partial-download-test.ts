import {expect} from 'chai';

import TestConfig from './test-config';

import PartialDownload from '../models/partial-download';

describe('Partial download', () => {
    it('download a segment of a file', function(done) {
        this.timeout(TestConfig.Timeout);

        let segmentSize: number = 0;

        new PartialDownload()
            .start(TestConfig.AcceptRangesSupportedUrl.url, {start: 0, end: 199})
            .on('data', (data, offset) => {
                segmentSize += data.length;
            })
            .on('end', () => {
                expect(segmentSize).to.equal(200);
                done();
            });
    });
});