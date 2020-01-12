export interface Instantiable<T> {
    new( ...args: any[] ): T;
}

export function isInstantiable( something: unknown ): something is Instantiable<any> {
    return (something as Instantiable<any>)?.prototype?.constructor !== undefined;
}

export type Qualifier = string | symbol;

export function isQualifier( something: unknown ): something is Qualifier {
    const type = typeof something;
    return type === 'string' || type === 'symbol';
}

export interface DependencyRegistry {
    [name: string]: Instantiable<any>;
}

export interface ApplicationContext {
    loadDependency: <T> ( Dependency: Instantiable<T> ) => Promise<T>;
    load: <T> ( EntryClass?: Instantiable<T> ) => Promise<T>;
}

export interface ModifiableApplicationContext extends ApplicationContext {
    add( dependency: string, on: ContextContainer ): void;
    registerDependency<T>( clazz: Instantiable<T>, qualifier?: string ): void;
}

export interface ContextContainer  {
    target: any;
    key: any;
}
