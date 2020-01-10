import {
    Instantiable,
    modifiableApplicationContext
} from './internal';

export function Component<T>( clazz: Instantiable<T> ) {
    modifiableApplicationContext.registerDependency(clazz);
}
