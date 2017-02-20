/// <reference path='../node_modules/@types/node/index.d.ts' />

import fs = require('fs');
import validator = require('validator');

export default class Validation {
    public static isUrl(url: string): boolean {
        return validator.isURL(url);
    }

    public static isValidNumberOfConnections(numOfConnections: number): boolean {
        const isValid: boolean = numOfConnections > 0;

        return isValid;
    }

    public static isDirectory(directory: string): boolean {
        const stat: fs.Stats = fs.lstatSync(directory);

        return stat.isDirectory();
    }
}