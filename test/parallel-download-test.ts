/// <reference path='../node_modules/@types/chai/index.d.ts' />

import fs = require('fs');
import os = require('os');

import {expect} from 'chai';

import ParallelDownload from '../models/parallel-download';

describe('Parallel download', () => {
    it('download with Accept-Ranges header without saving file', function(done) {
        this.timeout(5000);

        const fileContentLength: number = 663451;
        let fileContentLengthCounter: number = 0;

        new ParallelDownload()
            .start('https://homepages.cae.wisc.edu/~ece533/images/cat.png', 5)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', () => {
                expect(fileContentLengthCounter).to.equal(fileContentLength);
                done();
            });
    });

    it('download with Accept-Ranges header and save file', function(done) {
        this.timeout(5000);

        const fileContentLength: number = 663451;
        let fileContentLengthCounter: number = 0;

        const directory: string = os.tmpdir();

        new ParallelDownload()
            .start('https://homepages.cae.wisc.edu/~ece533/images/cat.png', 5, directory)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', (filePath) => {
                expect(fileContentLengthCounter).to.equal(fileContentLength);

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
        this.timeout(5000);

        const fileContentLength: number = 51567;
        let fileContentLengthCounter: number = 0;

        new ParallelDownload()
            .start('https://s-media-cache-ak0.pinimg.com/736x/92/9d/3d/929d3d9f76f406b5ac6020323d2d32dc.jpg', 5)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', () => {
                expect(fileContentLengthCounter).to.equal(fileContentLength);
                done();
            });
    });
});