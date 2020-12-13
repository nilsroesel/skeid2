export interface RegisteredEndpoint {
    httpMethod: string;
    restMethod: Function;
    route?: Array<string>;
}
