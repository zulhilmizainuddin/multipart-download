import {expect} from 'chai';

import Validation from '../src/utilities/validation';

describe('Input validation', () => {
    it('is valid url', () => {
        const url: string = 'http://github.com';
        const result: boolean = Validation.isUrl(url);

        expect(result).to.be.true;
    });

    it('is valid number of connections', () => {
        const numOfConnections: number = 1;
        const result: boolean = Validation.isValidNumberOfConnections(numOfConnections);

        expect(result).to.be.true;
    });

    it('is invalid number of connections', () => {
        const numOfConnections: number = 0;
        const result: boolean = Validation.isValidNumberOfConnections(numOfConnections);

        expect(result).to.not.be.true;
    });

    it('is valid directory', () => {
        const directory: string = __dirname;
        const result: boolean = Validation.isDirectory(directory);

        expect(result).to.be.true;
    });

    it('is invalid directory', () => {
        const directory: string = '/invalid/directory';
        const result: boolean = Validation.isDirectory(directory);

        expect(result).to.not.be.true;
    });

    it('is valid file name', () => {
        const fileName: string = 'grumpy_cat.jpg';
        const result: boolean = Validation.isValidFileName(fileName);

        expect(result).to.be.true;
    });

    it('is invalid file name', () => {
        const fileName: string = 'grumpy*cat.jpg';
        const result: boolean = Validation.isValidFileName(fileName);

        expect(result).to.not.be.true;
    });
});