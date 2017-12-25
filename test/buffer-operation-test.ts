import {expect} from 'chai';

import {TestConfig} from './test-config';

import {BufferOperation} from '../src/models/buffer-operation';

describe('Buffer operation', () => {
    it('single connection download', function(done) {
        this.timeout(TestConfig.Timeout);

        const numOfConnections: number = 1;

        new BufferOperation()
            .start(TestConfig.AcceptRangesSupportedUrl.url, TestConfig.AcceptRangesSupportedUrl.contentLength, numOfConnections)
            .on('end', (buffer) => {
                expect(buffer.length).to.be.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);

                done();
            });
    });

    it('multi connection download', function(done) {
        this.timeout(TestConfig.Timeout);

        const numOfConnections: number = 5;

        new BufferOperation()
            .start(TestConfig.AcceptRangesSupportedUrl.url, TestConfig.AcceptRangesSupportedUrl.contentLength, numOfConnections)
            .on('end', (buffer) => {
                expect(buffer.length).to.be.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);

                done();
            });
    });
});