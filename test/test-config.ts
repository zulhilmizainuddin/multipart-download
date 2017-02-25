export interface ContentLengthUrlPair {
    readonly contentLength: number;
    readonly url: string;
}

export default class TestConfig {
    public static readonly AcceptRangesSupportedUrl: ContentLengthUrlPair = {contentLength: 663451, url: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png'};
    public static readonly AcceptRangesUnsupportedUrl: ContentLengthUrlPair = {contentLength: 51567, url: 'https://s-media-cache-ak0.pinimg.com/736x/92/9d/3d/929d3d9f76f406b5ac6020323d2d32dc.jpg'};

    public static readonly Timeout: number = 10000;
}