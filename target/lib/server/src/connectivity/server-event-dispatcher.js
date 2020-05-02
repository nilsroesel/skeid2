"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerEventDispatcher {
    constructor(connection) {
        this.connection = connection;
    }
    /**
     * Dispatch a sever-sent-event on the depending connection.
     * Will throw an error if connection is closed
     * @param name Name of the dispatched event
     * @param payload Payload of the dispatched event
     * @param id Optional id of the dispatched event
     */
    dispatch(name, payload, id) {
        const message = 'event:'
            .concat(name)
            .concat('\n')
            .concat(id ? `id:${id}\n` : '')
            .concat(`data: ${JSON.stringify(payload)}`)
            .concat('\n\n');
        this.connection.write(message);
    }
}
exports.ServerEventDispatcher = ServerEventDispatcher;
//# sourceMappingURL=server-event-dispatcher.js.map