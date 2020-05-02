import 'reflect-metadata';
import { Maybe, Qualifier } from '../../../global-types';
export declare type StatusCodeGenerator<T> = (obj: T) => number;
export declare function Produces<T>(statusCode: number | StatusCodeGenerator<T>, mimeType?: Maybe<string>): (target: any, methodName?: Maybe<Qualifier>) => void;
export interface ProducingMetadata {
    statusCode: Maybe<StatusCodeGenerator<any>>;
    mimeType: Maybe<string>;
}
export declare function getProducingDecoratorMetadata(from: Function): ProducingMetadata;
