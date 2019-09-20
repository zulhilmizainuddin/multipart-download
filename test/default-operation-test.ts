import {expect} from 'chai';

import {TestConfig} from './test-config';

import {DefaultOperation} from '../src/models/default-operation';

describe('Default operation', () => {
    it('single connection download', (done) => {
        const numOfConnections: number = 1;
        let fileContentLengthCounter: number = 0;

        new DefaultOperation()
            .start(TestConfig.AcceptRangesSupportedUrl.url, TestConfig.AcceptRangesSupportedUrl.contentLength, numOfConnections)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', () => {
                expect(fileContentLengthCounter).to.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);

                done();
            });
    }).timeout(TestConfig.Timeout);

    it('multi connection download', (done) => {
        const numOfConnections: number = 5;
        let fileContentLengthCounter: number = 0;

        new DefaultOperation()
            .start(TestConfig.AcceptRangesSupportedUrl.url, TestConfig.AcceptRangesSupportedUrl.contentLength, numOfConnections)
            .on('data', (data, offset) => {
                fileContentLengthCounter += data.length;
            })
            .on('end', () => {
                expect(fileContentLengthCounter).to.equal(TestConfig.AcceptRangesSupportedUrl.contentLength);

                done();
            });
    }).timeout(TestConfig.Timeout);
});