import 'reflect-metadata';
import { Response, ResponseFactory } from '../connectivity';
import { Instantiable, Maybe, Qualifier } from '../../../global-types';
declare type SelectorFunction<T> = (factory: ResponseFactory) => () => Instantiable<T>;
export interface ResponseEntityInjectionMetadata {
    index: number;
    select: SelectorFunction<any>;
}
export declare function ResponseEntity<T extends Response>(select: SelectorFunction<T>): (target: any, methodName: Qualifier, index: number) => void;
export declare function getResponseEntityInjectionMetadata(from: Function): Maybe<ResponseEntityInjectionMetadata>;
export {};
