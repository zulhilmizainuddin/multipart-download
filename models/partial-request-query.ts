import request = require('request');

interface PartialRequestMetadata {
    acceptRanges: string;
    contentLength: number;
}

export class PartialRequestQuery {
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