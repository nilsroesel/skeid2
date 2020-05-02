/// <reference types="node" />
import 'reflect-metadata';
import { Instantiable, Maybe } from '../../../global-types';
export declare type DeserializerFunction<T> = (obj: T) => string | Buffer;
export declare function Deserialize<T>(deserializer: (obj: T) => string, mimeType?: Maybe<string>): <T_1>(target: Instantiable<T_1>) => void;
export interface DeserializerMetadata {
    deserializer?: Maybe<DeserializerFunction<any>>;
    mimeType?: Maybe<string>;
}
export declare function getDeserializerMetadata(from: Function): DeserializerMetadata;
