import 'reflect-metadata';
import { RestSchema } from '../schema';
import { Maybe } from '../../../global-types';
export declare function QueryParameters<T>(parameterSchema: RestSchema<T>): (target: any, methodName: string) => void;
export declare function getQueryParameterSchemaFromMetadata(from: Function): Maybe<RestSchema<any>>;
