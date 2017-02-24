"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class PathFormatter {
    static format(directory, filename) {
        const fullPath = `${directory}${path.sep}${filename}`;
        return fullPath;
    }
}
exports.default = PathFormatter;
