import 'reflect-metadata';
import { Maybe, Qualifier } from '../../../global-types';
import { RestSchema } from '../schema';
export declare const requestBodyMetadata: unique symbol;
export declare const requestBodyJsonSchema: unique symbol;
export declare function RequestBody<T>(schema: any | RestSchema<T>, propertyKey?: Maybe<Qualifier>, parameterIndex?: Maybe<number>): any;
export declare function getRequestParameterIndexFromMethodMetaData(from: Function): Maybe<number>;
export declare function getBodySchemaFromMethodMetadata(from: Function): Maybe<RestSchema<unknown>>;
