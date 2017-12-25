import fs = require('fs');
import os = require('os');

import {expect} from 'chai';

import {TestConfig} from './test-config';

import {FileOperation} from '../src/models/file-operation';

describe('File operation', () => {
    it('single connection download', function(done) {
        this.timeout(TestConfig.Timeout);

        const numOfConnections: number = 1;
        let fileContentLengthCounter: number = 0;

        new FileOperation(os.tmpdir())
            .start(TestConfig.AcceptRangesSupportedUrl.url, TestConfig.AcceptRangesSupportedUrl.contentLength, numOfConnections)
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

    it('multi connection download and save file with name from url', function(done) {
        this.timeout(TestConfig.Timeout);

        const numOfConnections: number = 5;
        let fileContentLengthCounter: number = 0;

        new FileOperation(os.tmpdir())
            .start(TestConfig.AcceptRangesSupportedUrl.url, TestConfig.AcceptRangesSupportedUrl.contentLength, numOfConnections)
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

    it('multi connection download and save file with name with specified name', function(done) {
        this.timeout(TestConfig.Timeout);

        const numOfConnections: number = 5;
        let fileContentLengthCounter: number = 0;

        new FileOperation(os.tmpdir(), 'kittycat.png')
            .start(TestConfig.AcceptRangesSupportedUrl.url, TestConfig.AcceptRangesSupportedUrl.contentLength, numOfConnections)
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
});