export interface Instantiable<T> {
    new (...args: any[]): T;
}
export declare function isInstantiable(something: unknown): something is Instantiable<any>;
