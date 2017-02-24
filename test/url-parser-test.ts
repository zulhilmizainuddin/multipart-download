import {expect} from 'chai';

import UrlParser from '../src/utilities/url-parser';

describe('Url parser', () => {
    it('get filename from url', () => {
        const filename: string = 'cat.png';

        const result: string = UrlParser.getFilename('https://homepages.cae.wisc.edu/~ece533/images/cat.png');

        expect(result).to.equal(filename);
    });
});