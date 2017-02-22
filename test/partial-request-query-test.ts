/// <reference path='../node_modules/@types/chai/index.d.ts' />

import {expect} from 'chai';

import PartialRequestQuery from '../models/partial-request-query';

describe('Partial request query', () => {
    it('with Accept-Ranges header', function(done) {
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

    it('without Accept-Ranges header', function(done) {
        this.timeout(5000);

        const partialRequestQuery: PartialRequestQuery = new PartialRequestQuery();

        partialRequestQuery
            .getMetadata('https://s-media-cache-ak0.pinimg.com/736x/92/9d/3d/929d3d9f76f406b5ac6020323d2d32dc.jpg')
            .then((metadata) => {
                expect(metadata.acceptRanges).to.not.exist;
                expect(metadata.contentLength).to.not.be.NaN;
                done();
            });
    });
});