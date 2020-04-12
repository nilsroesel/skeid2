import { RestSchema } from './rest-schema';

export type Serializer<T> = ( something: any ) => T | never;

export function DateSerializer( dateString: string ): Date {
    return new Date(dateString);
}

export function ArraySerializer<T>( itemSchema: RestSchema<T> ): ( fromArray: Array<any> ) => Array<T> | never {
    const name = `ArrayOf[${ JSON.stringify(itemSchema.getLoggableSchemaDefinition()) }]`;
    const serializer  = {
        [name]: (fromArray: Array<any> ): Array<T> | never => {
            if ( !Array.isArray(fromArray) ) {
                throw new TypeError(`Expected <<${ fromArray }>> to be array type`);
            }
            return fromArray.map(item => itemSchema.serialize(item));
        }
    };
    return serializer[name]
}
