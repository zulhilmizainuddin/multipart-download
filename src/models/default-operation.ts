import events = require('events');

import {FileSegmentation} from '../utilities/file-segmentation';

import {Operation} from './operation';
import {PartialDownload, PartialDownloadRange} from './partial-download';

export class DefaultOperation implements Operation {

    private readonly emitter: events.EventEmitter = new events.EventEmitter();

    public start(url: string, contentLength: number, numOfConnections: number): events.EventEmitter {
        let endCounter: number = 0;

        const segmentsRange: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(contentLength, numOfConnections);
        for (const segmentRange of segmentsRange) {

            new PartialDownload()
                .start(url, segmentRange)
                .on('error', (err) => {
                    this.emitter.emit('error', err);
                })
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
