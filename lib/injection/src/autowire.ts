import 'reflect-metadata'

import {
    Instantiable,
    modifiableApplicationContext,
    Qualifier,
} from './internal';

import {
    isInstantiable
} from './types';

export function Autowired( qualifier: Instantiable<unknown> | Object, key?: Qualifier ): PropertyDecorator | any  {
    if ( isInstantiable(qualifier) && key === undefined ) {
        return handleAsDecoratorFactory(qualifier);
    }

    if ( typeof key === 'string' ) {
        return handleAsPlainDecorator(qualifier, key);
    }
}

function handleAsDecoratorFactory( qualifier: Instantiable<unknown> ): PropertyDecorator {
    return ( target: Object , key: string | symbol ) => {
        modifiableApplicationContext.add(qualifier.name, { target, key });
    }
}

function handleAsPlainDecorator( target: Object, key: Qualifier ): void {
    const field = Reflect.getMetadata('design:type', target as any, key as Qualifier);
    if ( !field ) {
        throw new Error(`Circular Dependency detected.
                The reflection api will return undefined if so.
                This issue is related to circular dependencies in typescripts module resolution.
                Check https://github.com/Microsoft/TypeScript/issues/4521
                If this general issue is solved, the circular dependencies would work here without issues.
            `);
    }
    modifiableApplicationContext.add(field.name, { target, key });
}
