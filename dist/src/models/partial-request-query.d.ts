export interface PartialRequestMetadata {
    readonly acceptRanges: string;
    readonly contentLength: number;
}
export default class PartialRequestQuery {
    getMetadata(url: string): Promise<PartialRequestMetadata>;
}
