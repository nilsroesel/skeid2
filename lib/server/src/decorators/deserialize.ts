import 'reflect-metadata';

import { Instantiable, Maybe } from '../../../global-types';
import { assignOnlyDefinedMetadata } from './utils';

const deserializerMetadata = Symbol('error-deserializer:string');
const deserializerMimeMetadata = Symbol('error-deserializer:mime');

export type DeserializerFunction<T> = ( obj: T ) => string | Buffer;

// Default is resolved by content type: if application/json its JSON.stringify, else its Object.toString()
export function Deserialize<T>( deserializer: (obj: T) => string, mimeType?: Maybe<string> ) {
    return <T>( target: Instantiable<T> ) => {
        assignOnlyDefinedMetadata(target, deserializerMetadata, deserializer);
        assignOnlyDefinedMetadata(target, deserializerMimeMetadata, mimeType);
    }
}

export interface DeserializerMetadata {
    deserializer?: Maybe<DeserializerFunction<any>>;
    mimeType?: Maybe<string>;
}

export function getDeserializerMetadata( from: Function ): DeserializerMetadata {
    return {
        deserializer: Reflect.getMetadata(deserializerMetadata, from),
        mimeType: Reflect.getMetadata(deserializerMimeMetadata, from)
    }
}
