import { RestSchema } from './rest-schema';
export declare type Serializer<T> = (something: any) => T | never;
export declare function DateSerializer(dateString: string): Date;
export declare function ArraySerializer<T>(itemSchema: RestSchema<T>): (fromArray: Array<any>) => Array<T> | never;
