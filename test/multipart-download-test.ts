import fs = require('fs');
import os = require('os');

import {expect} from 'chai';

import {TestConfig} from './test-config';

import {MultipartDownload} from '../src/models/multipart-download';
import {StartOptions} from '../src/models/start-options';

describe('Multipart download', () => {
    xit('download with Accept-Ranges header without passing start options', function(done) {
        this.timeout(TestConfig.Timeout);

        let fileContentLengthCounter: number = 0;

        new MultipartDownload()
            .start(TestConfig.AcceptRangesSupportedUrl.url)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', () => {
                expect(fileContentLengthCounter).to.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);
                done();
            });
    });
    
    xit('download with Accept-Ranges header without saving file', function(done) {
        this.timeout(TestConfig.Timeout);

        const options: StartOptions = {
            numOfConnections: 5
        };

        let fileContentLengthCounter: number = 0;

        new MultipartDownload()
            .start(TestConfig.AcceptRangesSupportedUrl.url, options)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', () => {
                expect(fileContentLengthCounter).to.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);
                done();
            });
    });

    it('download with Accept-Ranges header and save file with name from url', function(done) {
        this.timeout(TestConfig.Timeout);

        const options: StartOptions = {
            numOfConnections: 5,
            saveDirectory: os.tmpdir()
        };

        let fileContentLengthCounter: number = 0;

        new MultipartDownload()
            .start(TestConfig.AcceptRangesSupportedUrl.url, options)
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

    it('download with Accept-Ranges header and save file with specified name', function(done) {
        this.timeout(TestConfig.Timeout);

        const options: StartOptions = {
            numOfConnections: 5,
            saveDirectory: os.tmpdir(),
            fileName: 'kittycat.png'
        };

        let fileContentLengthCounter: number = 0;

        new MultipartDownload()
            .start(TestConfig.AcceptRangesSupportedUrl.url, options)
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

    xit('download without Accept-Ranges header without saving file', function(done) {
        this.timeout(TestConfig.Timeout);

        const options: StartOptions = {
            numOfConnections: 5
        };

        let fileContentLengthCounter: number = 0;

        new MultipartDownload()
            .start(TestConfig.AcceptRangesUnsupportedUrl.url, options)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', () => {
                expect(fileContentLengthCounter).to.equal(TestConfig.AcceptRangesUnsupportedUrl.contentLength);
                done();
            });
    });
});