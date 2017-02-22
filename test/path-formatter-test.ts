/// <reference path='../node_modules/@types/chai/index.d.ts' />

import os = require('os');
import path = require('path');

import {expect} from 'chai';

import PathFormatter from '../utilities/path-formatter';

describe('Path formatter', () => {
    it('is correct path format', () => {
        const filePath: string = `${os.tmpdir()}${path.sep}test.txt`;

        const result: string = PathFormatter.format(os.tmpdir(), 'test.txt');

        expect(result).to.equal(filePath);
    });
});