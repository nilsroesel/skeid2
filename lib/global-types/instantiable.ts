export interface Instantiable<T> {
    new( ...args: any[] ): T;
}

export function isInstantiable( something: unknown ): something is Instantiable<any> {
    return (something as Instantiable<any>)?.prototype?.constructor !== undefined;
}
