import {
    Instantiable,
    modifiableApplicationContext,
    Qualifier
} from './internal';

import {
    isInstantiable,
    isQualifier
} from './types';

export function Component<T>( qualifier: Instantiable<T> | Qualifier  ): any {
   if ( isQualifier(qualifier) ) {
       return handleAsDecoratorFactory(qualifier);
   } else if ( isInstantiable(qualifier) ) {
       return handleAsPlainDecorator(qualifier);
   }

   throw new Error('Invalid argument for component decorator');
}

function handleAsDecoratorFactory( qualifier: Qualifier ) {
    if ( !isQualifier(qualifier) ) {
        throw new Error('Invalid Qualifier');
    }
    return <T>( clazz: Instantiable<T> ): void | T => {
        modifiableApplicationContext.registerDependency(clazz, String(qualifier));
    };
}

function handleAsPlainDecorator<T>( clazz: Instantiable<T> ) {
    modifiableApplicationContext.registerDependency(clazz);
}
