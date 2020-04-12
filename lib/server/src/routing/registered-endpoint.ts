import { RestSchema } from '../schema';

export interface RegisteredEndpoint<T> {
    httpMethod: string;
    restMethod: Function;
    route?: Array<string>;
    schema?: RestSchema<T> | undefined;
}
