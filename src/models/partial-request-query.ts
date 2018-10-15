import request = require('request');

export interface PartialRequestMetadata {
    readonly acceptRanges: string;
    readonly contentLength: number;
}

export class PartialRequestQuery {
    public getMetadata(url: string, headers?: request.Headers): Promise<PartialRequestMetadata> {

        return new Promise<PartialRequestMetadata>((resolve, reject) => {
            const options: request.CoreOptions = {'headers': {'Range': 'bytes=0-0'}};

            request.get(url, options, (err, res, body) => {
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
