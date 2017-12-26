import {BufferOperation} from './buffer-operation';
import {DefaultOperation} from './default-operation';
import {FileOperation} from './file-operation';
import {Operation} from './operation';
import {StartOptions} from './start-options';

export class OperationFactory {
    static getOperation(options: StartOptions): Operation {

        let operation: Operation;
        if (options.writeToBuffer) {
            operation = new BufferOperation();
        } else if (options.saveDirectory) {
            operation = new FileOperation(options.saveDirectory, options.fileName);
        } else {
            operation = new DefaultOperation();
        }

        return operation;
    }
}