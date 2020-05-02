export interface RegisteredEndpoint<T> {
    httpMethod: string;
    restMethod: Function;
    route?: Array<string>;
}
