import {expect} from 'chai';

import {TestConfig} from './test-config';

import {BufferOperation} from '../src/models/buffer-operation';

describe('Buffer operation', () => {
    it('single connection download', function(done) {
        this.timeout(TestConfig.Timeout);

        const numOfConnections: number = 1;
        let fileContentLengthCounter: number = 0;

        new BufferOperation()
            .start(TestConfig.AcceptRangesSupportedUrl.url, TestConfig.AcceptRangesSupportedUrl.contentLength, numOfConnections)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', (buffer) => {
                expect(buffer.length).to.be.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);
                expect(fileContentLengthCounter).to.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);

                done();
            });
    });

    it('multi connection download', function(done) {
        this.timeout(TestConfig.Timeout);

        const numOfConnections: number = 5;
        let fileContentLengthCounter: number = 0;

        new BufferOperation()
            .start(TestConfig.AcceptRangesSupportedUrl.url, TestConfig.AcceptRangesSupportedUrl.contentLength, numOfConnections)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', (buffer) => {
                expect(buffer.length).to.be.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);
                expect(fileContentLengthCounter).to.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);

                done();
            });
    });
});