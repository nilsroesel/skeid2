import 'reflect-metadata'

import { modifiableApplicationContext } from './internal';
import {
    Instantiable,
    isInstantiable,
    isQualifier,
    Qualifier
} from '../../global-types';

export function Autowired( qualifier: Instantiable<unknown> | Object | Qualifier, key?: Qualifier ):  any  {
    if ( ( isInstantiable(qualifier) || isQualifier(qualifier) ) && key === undefined ) {
        return handleAsDecoratorFactory(qualifier);
    }

    if ( typeof key === 'string' ) {
        return handleAsPlainDecorator(qualifier, key);
    }
}

function handleAsDecoratorFactory( qualifier: Instantiable<unknown> | Qualifier ): PropertyDecorator {
    let qualifyingName: string;
    if ( isInstantiable(qualifier) ) {
        qualifyingName = qualifier.name;
    } else if ( isQualifier(qualifier) ) {
        qualifyingName = String(qualifier);
    } else {
        throw new Error('Unexpected qualifier of dependency');
    }
    return ( target: Object , key: string | symbol ) => {
        modifiableApplicationContext.registerDependency(qualifyingName, { target, key });
    }
}

function handleAsPlainDecorator( target: Object, key: Qualifier ): void {
    const field = Reflect.getMetadata('design:type', target as any, key as Qualifier);
    if ( !field ) {
        throw new Error(`Circular Dependency detected.
                The reflection api will return undefined if so.
                This issue is related to circular dependencies in typescripts module resolution.
                Check out the following discussions for the issue
                https://github.com/Microsoft/TypeScript/issues/4521
                https://github.com/Microsoft/TypeScript/issues/20361
                If this general issue is solved, the circular dependencies would work here without issues.
            `);
    }
    modifiableApplicationContext.registerDependency(field.name, { target, key });
}
