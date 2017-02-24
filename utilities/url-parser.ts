import url = require('url');

export default class UrlParser {
    public static getFilename(fileUrl: string): string {
        const parsedUrl = url.parse(fileUrl);

        const filename = new RegExp(/(?:\/.+)?\/(.+)/, '').exec(parsedUrl.path);

        return filename[1];
    }
}