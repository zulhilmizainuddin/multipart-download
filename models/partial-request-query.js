"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
class PartialRequestQuery {
    getMetadata(url) {
        return new Promise((resolve, reject) => {
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
exports.default = PartialRequestQuery;
