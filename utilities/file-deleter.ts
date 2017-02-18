/// <reference path='../node_modules/@types/node/index.d.ts' />

import fs = require('fs');

export default class FileDeleter {
    public static delete(...filePaths: string[]): void {
        for (let filePath of filePaths) {
            fs.unlink(filePath);
        }
    }
}