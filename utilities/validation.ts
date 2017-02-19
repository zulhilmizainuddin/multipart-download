/// <reference path='../node_modules/@types/node/index.d.ts' />

import fs = require('fs');
import validator = require('validator');

export default class Validation {
    public static isDirectory(directory: string): boolean {
        const stat = fs.lstatSync(directory);

        return stat.isDirectory();
    }

    public static isUrl(url: string): boolean {
        return validator.isURL(url);
    }
}