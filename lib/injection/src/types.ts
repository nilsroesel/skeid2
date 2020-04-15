import { Instantiable, Loader, Maybe, Qualifier } from '../../global-types';

export interface DependencyRegistry {
    [name: string]: Instantiable<any>;
}

export interface ApplicationContext extends Loader {
    loadDependency: <T> ( Dependency: Instantiable<T> ) => Promise<T>;
    load: <T> ( EntryClass?: Maybe<Instantiable<T>> ) => Promise<T>;
}

export interface ModifiableApplicationContext extends ApplicationContext {
    add( dependency: string, on: ContextContainer ): void;
    addAfterLoad<T>( dependency: Instantiable<T>, methodName: Qualifier ): void;
    registerDependency<T>( clazz: Instantiable<T>, qualifier?: string ): void;
}

export interface ContextContainer  {
    target: any;
    key: any;
}
