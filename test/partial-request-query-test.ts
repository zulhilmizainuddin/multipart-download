/// <reference path='../node_modules/@types/chai/index.d.ts' />

import {expect} from 'chai';

import PartialRequestQuery from '../models/partial-request-query';

describe('Partial request query', () => {
    it('support Accept-Ranges', function(done) {
        this.timeout(5000);

        const partialRequestQuery: PartialRequestQuery = new PartialRequestQuery();

        partialRequestQuery
            .getMetadata('https://homepages.cae.wisc.edu/~ece533/images/cat.png')
            .then((metadata) => {
                expect(metadata.acceptRanges).to.equal('bytes');
                expect(metadata.contentLength).to.not.be.NaN;
                done();
            });
    });
});