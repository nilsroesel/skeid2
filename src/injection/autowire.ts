import 'reflect-metadata'

import {
    Autowirable,
    modifiableApplicationContext,
    Qualifier,
} from './internal';

export function Autowired( target: Autowirable, key?: string ): any {
    if ( target && !key ) {
        let qualifier: string;
        if ( typeof target === 'string' ) {
            qualifier = target;
        } else if ( typeof target === 'function' ) {
            qualifier = target.name;
        } else {
            throw new TypeError(`${ target } is neither a class or qualifier`)
        }
        return (t: any , k: any) => {
            modifiableApplicationContext.add(qualifier, { target: t, key: k });
        }
    } else if ( !!target && !!key ) {
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
}
