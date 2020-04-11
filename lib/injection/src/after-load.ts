import { InvalidDecoratedItemError } from '../../configuration/error';
import { Instantiable, Qualifier } from '../../global-types';
import { modifiableApplicationContext } from './appplication-context';

export function AfterLoad<T>( target: Object, name: Qualifier, descriptor: TypedPropertyDescriptor<T> ): void {
    if ( typeof descriptor?.value !== 'function' ) {
        throw new InvalidDecoratedItemError(AfterLoad, ['METHOD']);
    }
    modifiableApplicationContext.addAfterLoad(target.constructor as Instantiable<any>, name);
}
