export interface ContentLengthUrlPair {
    readonly contentLength: number;
    readonly url: string;
}

export class TestConfig {
    public static readonly AcceptRangesSupportedUrl: ContentLengthUrlPair = {contentLength: 992514, url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg'};
    public static readonly AcceptRangesUnsupportedUrl: ContentLengthUrlPair = {contentLength: 51567, url: 'https://s-media-cache-ak0.pinimg.com/736x/92/9d/3d/929d3d9f76f406b5ac6020323d2d32dc.jpg'};

    public static readonly Timeout: number = 10000;
}