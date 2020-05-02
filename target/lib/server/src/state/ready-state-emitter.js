"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class ReadyStateEmitter {
    constructor() {
        this.emitter = new events_1.EventEmitter();
        this.state = false;
    }
    static compose(...emitters) {
        const composedEmitter = new ReadyStateEmitter();
        if (emitters.length === 0) {
            composedEmitter.changeStateToReady();
        }
        emitters.forEach(emitter => {
            emitter.whenReady(() => {
                const allEmitterStates = emitters.map(e => e.getReadyState());
                const allEmittersAreReady = allEmitterStates.reduce((a, c) => a && c, true);
                if (allEmittersAreReady) {
                    composedEmitter.changeStateToReady();
                }
            });
        });
        return composedEmitter;
    }
    getReadyState() {
        return this.state;
    }
    changeStateToReady() {
        this.state = true;
        this.emitter.emit('ready');
        this.emitter.removeAllListeners();
    }
    whenReady(callback) {
        if (this.state) {
            return callback();
        }
        this.emitter.addListener('ready', callback);
    }
}
exports.ReadyStateEmitter = ReadyStateEmitter;
//# sourceMappingURL=ready-state-emitter.js.map