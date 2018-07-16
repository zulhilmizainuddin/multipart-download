import events = require('events');
import fs = require('fs');

import {FileSegmentation} from '../utilities/file-segmentation';
import {PathFormatter} from '../utilities/path-formatter';
import {UrlParser} from '../utilities/url-parser';

import {Operation} from "./operation";
import {PartialDownload, PartialDownloadRange} from './partial-download';

export class FileOperation implements Operation {

    private readonly emitter: events.EventEmitter = new events.EventEmitter();

    public constructor(private saveDirectory: string, private fileName?: string) { }

    public start(url: string, contentLength: number, numOfConnections: number): events.EventEmitter {
        const file: string = this.fileName ? this.fileName: UrlParser.getFilename(url);
        const filePath: string = PathFormatter.format(this.saveDirectory, file);

        let endCounter: number = 0;
        
        fs.open(filePath, 'w+', 0o644, (err, fd) => {
            if (err) {
                this.emitter.emit('error', err);
                return 
            }
            
            const segmentsRange: PartialDownloadRange[] = FileSegmentation.getSegmentsRange(contentLength, numOfConnections);
            
            for (let segmentRange of segmentsRange) {

                new PartialDownload()
                    .start(url, segmentRange)
                    .on('error', (err) => {
                        this.emitter.emit('error', err);
                    })
                    .on('data', (data, offset) => {
                        fs.write(fd, data, 0, data.length, offset, (err) => {
                            if (err) {
                                this.emitter.emit('error', err);
                            } else {
                                this.emitter.emit('data', data, offset);
                            }
                        });
                    })
                    .on('end', () => {
                        if (++endCounter === numOfConnections) {
                            fs.close(fd, (err) => {
                                if (err) {
                                    this.emitter.emit('error', err);
                                } else {
                                    this.emitter.emit('end', filePath);
                                }
                            });
                        }
                    });
            }

        });
        
        return this.emitter;
    }

}
