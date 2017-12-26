import fs = require('fs');
import os = require('os');

import {expect} from 'chai';

import {TestConfig} from './test-config';

import {MultipartDownload} from '../src/models/multipart-download';
import {StartOptions} from '../src/models/start-options';

describe('Multipart download', () => {
    it('download with Accept-Ranges header without passing start options', function(done) {
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
    
    it('download with Accept-Ranges header with start options', function(done) {
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

    it('download without Accept-Ranges header with start options', function(done) {
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