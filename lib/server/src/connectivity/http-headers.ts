export type HttpHeaders = {
    [header: string]: string | Array<string>;
}

export type HttpHeaderSet = Set<[string, string | Array<string>]>;
