import 'reflect-metadata';
import { Maybe, Qualifier } from '../../../global-types';
export declare const MIME_WILDCARD: string;
export declare function Consumes(mimeType: string): (component: any, methodName: Qualifier) => void;
export declare function getConsumingMimeType(from: Function): Maybe<string>;
