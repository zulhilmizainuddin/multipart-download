import events = require('events');

import {FileSegmentation} from '../utilities/file-segmentation';

import {Operation} from "../models/operation";
import {PartialDownload, PartialDownloadRange} from '../models/partial-download';

export class DefaultOperation implements Operation {

    private readonly emitter: events.EventEmitter = new events.EventEmitter();

    public start(url: string, contentLength: number, numOfConnections: number): events.EventEmitter {
        let endCounter: number = 0;

        const segmentsRange: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(contentLength, numOfConnections);
        for (let segmentRange of segmentsRange) {

            new PartialDownload()
                .start(url, segmentRange)
                .on('data', (data, offset) => {
                    this.emitter.emit('data', data, offset);
                })
                .on('end', () => {
                    if (++endCounter === numOfConnections) {
                        this.emitter.emit('end', null);
                    }
                });
        }

        return this.emitter;
    }
}