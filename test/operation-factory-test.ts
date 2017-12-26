import os = require('os');

import {expect} from 'chai';

import {TestConfig} from './test-config';

import {BufferOperation} from '../src/models/buffer-operation';
import {DefaultOperation} from '../src/models/default-operation';
import {FileOperation} from '../src/models/file-operation';
import {Operation} from '../src/models/operation';
import {OperationFactory} from '../src/models/operation-factory';
import {StartOptions} from '../src/models/start-options';

describe('Operation factory', () => {
    it('default operation', () => {
        const options: StartOptions = {};

        const operation: Operation = OperationFactory.getOperation(options);

        expect(operation).to.be.instanceof(DefaultOperation);
    });

    it('buffer operation', () => {
        const options: StartOptions = {
            writeToBuffer: true
        };

        const operation: Operation = OperationFactory.getOperation(options);

        expect(operation).to.be.instanceof(BufferOperation);
    });

    it('file operation', () => {
        const options: StartOptions = {
            saveDirectory: os.tmpdir()
        };

        const operation: Operation = OperationFactory.getOperation(options);

        expect(operation).to.be.instanceof(FileOperation);
    });
});