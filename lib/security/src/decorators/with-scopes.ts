import { Scope, Scopes } from '../';
import { Maybe, Qualifier } from '../../../global-types';


export const endpointMethodScopeMetadata = Symbol('scope:');

export function WithScopes( scope: string | Scope ) {
    const declaredScope = scope instanceof Scope ? scope : Scopes.allOf(scope);
    return ( target: any, propertyKey: Qualifier, propertyDescriptor: PropertyDescriptor ) => {
        Reflect.defineMetadata(endpointMethodScopeMetadata, declaredScope, target[propertyKey]);
    };
}

export function getEndpointScopeFromMethodMetaData( from: Function ): Scope {
    const declaredScope: Maybe<Scope> = Reflect.getMetadata(endpointMethodScopeMetadata, from);
    return declaredScope || Scopes.unscoped();
}
