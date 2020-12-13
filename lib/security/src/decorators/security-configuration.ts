import { Instantiable, Maybe } from '../../../global-types';
import { ConfigurationError } from '../../../configuration/error';
import { AuthorizationConfiguration } from '../';

let isUsed = false;
let configurationClass: Maybe<Instantiable<AuthorizationConfiguration>>;

export function getSecurityConfigurationClass(): Maybe<Instantiable<AuthorizationConfiguration>> {
    return configurationClass;
}

export function SecurityConfiguration <T extends AuthorizationConfiguration> ( clazz: Instantiable<T> ) {
    if ( isUsed ) {
        throw new ConfigurationError('Multiple classes are meant to configure the security, but only one is allowed.')
    }
    isUsed = true;
    configurationClass = clazz;
}
