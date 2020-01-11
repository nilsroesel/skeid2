import 'reflect-metadata'

import {
    ApplicationContext,
    ContextContainer,
    DependencyRegistry,
    Instantiable,
    ModifiableApplicationContext
} from './types';

class ApplicationContextImpl implements ModifiableApplicationContext {
    private dependencyToInjectionsMap: Map<string, Array<ContextContainer>> = new Map();
    private dependencyRegistry: DependencyRegistry = {};

    add( dependency: string, on: ContextContainer ): void {
        const list: Array<ContextContainer> = this.dependencyToInjectionsMap.get(dependency) || [];
        list.push(on);
        this.dependencyToInjectionsMap.set(dependency, list);
    }

    registerDependency<T>( clazz: Instantiable<T> ): void {
        this.dependencyRegistry[clazz.name] = new clazz() as any;
    }

    loadDependency <T> ( Dependency: Instantiable<T> ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if ( !Object.getOwnPropertyDescriptor(ApplicationContextImpl, 'INITIALIZED') ) {
                reject(<unknown>new Error('Application Context is not loaded yet.'));
            }
            if ( !this.dependencyRegistry[Dependency.name] ) {
                reject(<unknown>new Error(`No dependency <<${ Dependency.name }>> found.`));
            }
            if ( !(this.dependencyRegistry[Dependency.name] instanceof Dependency) ) {
                reject(new Error(`Dependency <<${ Dependency.name }>> is no valid instance of the desired type.`));
            }
            resolve(<unknown>this.dependencyRegistry[Dependency.name] as T);
        });
    }

    load <T> ( EntryClass?: Instantiable<T> ): Promise<T> {
        console.info('Loading application context');
        return new Promise(resolve => {
            Object.defineProperty(ApplicationContextImpl, 'INITIALIZED', {
                value: true, writable: false, configurable: false
            });
            this.dependencyToInjectionsMap.forEach((value, dependency) => {
                if ( !this.dependencyRegistry[dependency] ) {
                    throw new Error(`Unsatisfied dependency ${ dependency }`);
                }
                value.forEach((v: ContextContainer) => {
                    Object.defineProperty(v.target, v.key, {
                        value: this.dependencyRegistry[dependency],
                        writable: false,
                        configurable: false
                    });
                });
            });
            if ( !!EntryClass ) {
                this.loadDependency<T>(EntryClass).then(resolve);
            } else {
                resolve();
            }
        });
    }
}

const modifiableApplicationContext: ModifiableApplicationContext = new ApplicationContextImpl();

const applicationContext: ApplicationContext = {
    load: function <T> ( EntryClass?: Instantiable<T> ): Promise<T> {
        return modifiableApplicationContext.load(EntryClass)
    },
    loadDependency: function<T>( Dependency: Instantiable<T> ): Promise<T> {
        return modifiableApplicationContext.loadDependency(Dependency)
    }
};

export { applicationContext, modifiableApplicationContext };
