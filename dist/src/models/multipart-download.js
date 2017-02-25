"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const fs = require("fs");
const file_segmentation_1 = require("../utilities/file-segmentation");
const path_formatter_1 = require("../utilities/path-formatter");
const url_parser_1 = require("../utilities/url-parser");
const validation_1 = require("../utilities/validation");
const accept_ranges_1 = require("../models/accept-ranges");
const partial_download_1 = require("../models/partial-download");
const partial_request_query_1 = require("../models/partial-request-query");
class MultipartDownload extends events.EventEmitter {
    start(url, numOfConnections, saveDirectory) {
        const validationError = this.validateInputs(url, numOfConnections, saveDirectory);
        if (validationError) {
            throw validationError;
        }
        new partial_request_query_1.default()
            .getMetadata(url)
            .then((metadata) => {
            const metadataError = this.validateMetadata(url, metadata);
            if (metadataError) {
                throw metadataError;
            }
            if (metadata.acceptRanges !== accept_ranges_1.default.Bytes) {
                numOfConnections = 1;
            }
            let filePath = null;
            if (saveDirectory) {
                filePath = this.createFile(url, saveDirectory);
            }
            let writeStream;
            let endCounter = 0;
            const segmentsRange = file_segmentation_1.default.getSegmentsRange(metadata.contentLength, numOfConnections);
            for (let segmentRange of segmentsRange) {
                new partial_download_1.default()
                    .start(url, segmentRange)
                    .on('data', (data, offset) => {
                    this.emit('data', data, offset);
                    if (saveDirectory) {
                        writeStream = fs.createWriteStream(filePath, { flags: 'r+', start: offset });
                        writeStream.write(data);
                    }
                })
                    .on('end', () => {
                    if (saveDirectory) {
                        writeStream.end();
                    }
                    if (++endCounter === numOfConnections) {
                        this.emit('end', filePath);
                    }
                });
            }
        })
            .catch((err) => {
            throw err;
        });
        return this;
    }
    validateInputs(url, numOfConnections, saveDirectory) {
        if (!validation_1.default.isUrl(url)) {
            return new Error('Invalid URL provided');
        }
        if (!validation_1.default.isValidNumberOfConnections(numOfConnections)) {
            return new Error('Invalid number of connections provided');
        }
        if (saveDirectory && !validation_1.default.isDirectory(saveDirectory)) {
            return new Error('Invalid save directory provided');
        }
        return null;
    }
    validateMetadata(url, metadata) {
        if (isNaN(metadata.contentLength)) {
            return new Error(`Failed to query Content-Length of ${url}`);
        }
        return null;
    }
    createFile(url, directory) {
        const filename = url_parser_1.default.getFilename(url);
        const filePath = path_formatter_1.default.format(directory, filename);
        fs.createWriteStream(filePath).end();
        return filePath;
    }
}
exports.default = MultipartDownload;
