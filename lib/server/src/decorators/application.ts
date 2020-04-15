import * as http from 'http';

import { Instantiable, isInstantiable } from '../../../global-types';
import { applicationContext } from '../../../injection/src/external';
import {
    routesReadyState,
    ReadyStateEmitter,
    classFieldReadyStateEmitterComposer,
} from '../state';
import { RequestListener, RequestListenerFactory } from '../connectivity';
import { router } from '../routing/router';

export interface ApplicationConfiguration {
    port: number;
    isReadyWhen: Array<ReadyStateEmitter>;
}

export function Application( configuration: Partial<ApplicationConfiguration> ) {
    return decoratorFactory(configuration);
}

function decoratorFactory( configuration: Partial<ApplicationConfiguration> ) {
    return <T> ( clazz: Instantiable<T> ): void | never  => {
        if ( !isInstantiable(clazz) ) {
            throw new Error(`Can not apply @Application for ${ clazz }.`);
        }
        setTimeout(() => applicationContext.load().then(() => startServer(configuration)), 1);
    }
}

function startServer( configuration: Partial<ApplicationConfiguration> ): void {
    const configuredReadyStates = configuration.isReadyWhen || [];

    const applicationReadyState = ReadyStateEmitter.compose(
        routesReadyState.changeToReadyAfterApplicationWithEmptyRoutes(),
        classFieldReadyStateEmitterComposer.composeRegisteredEmitters(),
        ...configuredReadyStates
    );

    const requestListener: RequestListener = new RequestListenerFactory(router).create();

    applicationReadyState.whenReady(() => {
        http.createServer(requestListener).listen(configuration.port || 80, () => {
            console.info('INFO',`Api is up and listening on port ${ configuration.port || 80 }`);
            console.info('INFO','Using schema http');
        })
    });

}
