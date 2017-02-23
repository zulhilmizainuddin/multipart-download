import fs = require('fs');
import os = require('os');

import {expect} from 'chai';

import TestConfig from './test-config';

import MultipartDownload from '../models/multipart-download';

describe('Multipart download', () => {
    it('download with Accept-Ranges header without saving file', function(done) {
        this.timeout(TestConfig.Timeout);

        let fileContentLengthCounter: number = 0;

        new MultipartDownload()
            .start(TestConfig.AcceptRangesSupportedUrl.url, 5)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', () => {
                expect(fileContentLengthCounter).to.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);
                done();
            });
    });

    it('download with Accept-Ranges header and save file', function(done) {
        this.timeout(TestConfig.Timeout);

        let fileContentLengthCounter: number = 0;

        const directory: string = os.tmpdir();

        new MultipartDownload()
            .start(TestConfig.AcceptRangesSupportedUrl.url, 5, directory)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', (filePath) => {
                expect(fileContentLengthCounter).to.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);

                expect(filePath).to.exist;

                // check downloaded file exist
                fs.lstat(filePath, (err, stats) => {
                    expect(err).to.be.null;

                    // delete downloaded file
                    fs.unlink(filePath, (err) => {
                        expect(err).to.be.null;
                        
                        done();
                    });
                });
            });
    });

    it('download without Accept-Ranges header without saving file', function(done) {
        this.timeout(TestConfig.Timeout);

        let fileContentLengthCounter: number = 0;

        new MultipartDownload()
            .start(TestConfig.AcceptRangesUnsupportedUrl.url, 5)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', () => {
                expect(fileContentLengthCounter).to.equal(TestConfig.AcceptRangesUnsupportedUrl.contentLength);
                done();
            });
    });
});