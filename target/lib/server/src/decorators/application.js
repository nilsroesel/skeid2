"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const global_types_1 = require("../../../global-types");
const external_1 = require("../../../injection/src/external");
const state_1 = require("../state");
const connectivity_1 = require("../connectivity");
const router_1 = require("../routing/router");
function Application(configuration) {
    return decoratorFactory(configuration);
}
exports.Application = Application;
function decoratorFactory(configuration) {
    return (clazz) => {
        if (!global_types_1.isInstantiable(clazz)) {
            throw new Error(`Can not apply @Application for ${clazz}.`);
        }
        setTimeout(() => external_1.applicationContext.load().then(() => startServer(configuration)), 1);
    };
}
function startServer(configuration) {
    const configuredReadyStates = configuration.isReadyWhen || [];
    const applicationReadyState = state_1.ReadyStateEmitter.compose(state_1.routesReadyState.getSelfAndSetToReadyIfPristineAfterInit(), state_1.classFieldReadyStateEmitterComposer.composeRegisteredEmitters(), ...configuredReadyStates);
    const requestListener = new connectivity_1.RequestListenerFactory(router_1.router).create();
    applicationReadyState.whenReady(() => {
        http.createServer(requestListener).listen(configuration.port || 80, () => {
            console.info('INFO', `Api is up and listening on port ${configuration.port || 80}`);
            console.info('INFO', 'Using schema http');
        });
    });
}
//# sourceMappingURL=application.js.map