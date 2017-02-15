/// <reference path='../node_modules/@types/node/index.d.ts' />
/// <reference path='../node_modules/@types/request/index.d.ts' />

import request = require('request');

interface PartialRequestMetadata {
    readonly acceptRanges: string;
    readonly contentLength: number;
}

export default class PartialRequestQuery {
    public getMetadata(url: string): Promise<PartialRequestMetadata> {

        return new Promise<PartialRequestMetadata>((resolve, reject) => {
            request.head(url, (err, res, body) => {
                if (err) {
                    reject(err);
                }

                const metadata = {
                    acceptRanges: res.headers['accept-ranges'],
                    contentLength: parseInt(res.headers['content-length'])
                };

                resolve(metadata);
            });
        });
    }
}