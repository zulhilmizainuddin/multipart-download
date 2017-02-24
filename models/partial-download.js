"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const request = require("request");
const accept_ranges_1 = require("../models/accept-ranges");
class PartialDownload extends events.EventEmitter {
    start(url, range) {
        const options = {
            headers: {
                Range: `${accept_ranges_1.default.Bytes}=${range.start}-${range.end}`
            }
        };
        let offset = range.start;
        request
            .get(url, options)
            .on('error', (err) => {
            throw err;
        })
            .on('data', (data) => {
            this.emit('data', data, offset);
            offset += data.length;
        })
            .on('end', () => {
            this.emit('end');
        });
        return this;
    }
}
exports.default = PartialDownload;
