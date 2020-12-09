import { Instantiable, Loader, Maybe, Qualifier } from '../../global-types';

export interface DependencyRegistry {
    [name: string]: Instantiable<any>;
}

export interface ApplicationContext extends Loader {
    loadDependency: <T> ( Dependency: Instantiable<T> ) => Promise<T>;
    load: <T> ( EntryClass?: Maybe<Instantiable<T>> ) => Promise<T>;
}

export interface ModifiableApplicationContext extends ApplicationContext {
    addAfterLoad<T>( dependency: Instantiable<T>, methodName: Qualifier ): void;
    registerComponent<T>( clazz: Instantiable<T>, qualifier?: string ): void;
    registerDependency( dependency: string, on: ContextContainer ): void;
}

export interface ContextContainer  {
    target: any;
    key: any;
}
