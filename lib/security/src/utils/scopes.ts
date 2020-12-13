import { Scope } from './scope';

export class Scopes {
    static allOf( ... declaredScopes: Array<string> ): Scope {
        if ( declaredScopes.length === 0 ) return Scopes.unscoped();
        return new class extends Scope {
            isValid( scopes: Array<string> ): boolean {
                return declaredScopes.map(s => scopes.includes(s))
                    .reduce((a, b) => a && b);
            }
        }
    }

    static anyOf( ... declaredScopes: Array<string> ): Scope {
        if ( declaredScopes.length === 0 ) return Scopes.unscoped();
        return new class extends Scope {
            isValid( scopes: Array<string> ): boolean {
                return declaredScopes.map(s => scopes.includes(s))
                    .reduce((a, b) => a || b);
            }
        }
    }

    static unscoped(): Scope {
        return new class extends Scope {
            isValid( scopes: Array<string> ): boolean { return true; }
        }
    }

}
