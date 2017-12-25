import url = require('url');

export class UrlParser {
    public static getFilename(fileUrl: string): string {
        const parsedUrl: url.Url = url.parse(fileUrl);

        const filename: RegExpExecArray = new RegExp(/(?:\/.+)?\/(.+)/, '').exec(parsedUrl.path);

        return filename[1];
    }
}