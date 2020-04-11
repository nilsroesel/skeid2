import 'reflect-metadata'
import { EventEmitter } from 'events';

import {
    ApplicationContext,
    ContextContainer,
    DependencyRegistry,
    ModifiableApplicationContext
} from './types';
import { Instantiable } from '../../global-types';

class ApplicationContextImpl implements ModifiableApplicationContext {
    private dependencyToInjectionsMap: Map<string, Array<ContextContainer>> = new Map();
    private dependencyRegistry: DependencyRegistry = {};
    private loadedEvent: EventEmitter = new EventEmitter();

    public add( dependency: string, on: ContextContainer ): void {
        const list: Array<ContextContainer> = this.dependencyToInjectionsMap.get(dependency) || [];
        list.push(on);
        this.dependencyToInjectionsMap.set(dependency, list);
    }

    public registerDependency<T>( clazz: Instantiable<T>, qualifier?: string ): void {
        const dependencyName = !!qualifier? qualifier : clazz.name;
        this.dependencyRegistry[dependencyName] = new clazz() as any;
    }

    public loadDependency <T> ( Dependency: Instantiable<T> ): Promise<T> {
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

    public load <T> ( EntryClass?: Instantiable<T> ): Promise<T> {
        return new Promise(resolve => {
            const resolveAndEmit = (component?: T) => {
                this.loadedEvent.emit('loaded');
                this.loadedEvent.removeAllListeners();
                resolve(component);
            };
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
                this.loadDependency<T>(EntryClass).then(resolveAndEmit);
            } else {
                resolveAndEmit();
            }
        });
    }

    public whenLoaded( callback: Function ): void {
        if ( Object.getOwnPropertyDescriptor(ApplicationContextImpl, 'INITIALIZED') ) {
            callback();
            return;
        }
        this.loadedEvent.addListener('loaded', callback);
    }
}

const modifiableApplicationContext: ModifiableApplicationContext = new ApplicationContextImpl();

const applicationContext: ApplicationContext = {
    load: function <T> ( EntryClass?: Instantiable<T> ): Promise<T> {
        return modifiableApplicationContext.load(EntryClass)
    },
    loadDependency: function<T>( Dependency: Instantiable<T> ): Promise<T> {
        return modifiableApplicationContext.loadDependency(Dependency)
    },
    whenLoaded: function ( callback: Function ) {
        modifiableApplicationContext.whenLoaded(callback);
    }
};

export { applicationContext, modifiableApplicationContext };
