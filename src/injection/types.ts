export interface Instantiable<T> {
    new( ...args: any[] ): T;
}

export type Qualifier = string | symbol;

export interface DependencyRegistry {
    [name: string]: Instantiable<any>;
}

export interface ApplicationContext {
    loadDependency: <T> ( Dependency: Instantiable<T> ) => Promise<T>;
    load: <T> ( EntryClass?: Instantiable<T> ) => Promise<T>;
}

export interface ModifiableApplicationContext extends ApplicationContext {
    add( dependency: string, on: ContextContainer ): void;
    registerDependency<T>( clazz: Instantiable<T> ): void;
}

export type Autowirable = Instantiable<any> | any;

export interface ContextContainer  {
    target: any;
    key: any;
}
