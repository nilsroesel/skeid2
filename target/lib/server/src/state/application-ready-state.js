"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ready_state_emitter_1 = require("./ready-state-emitter");
class ApplicationReadyState extends ready_state_emitter_1.ReadyStateEmitter {
    constructor(readyStates) {
        super();
        this.readyStates = readyStates;
    }
    static compose(...readyStateEmitters) {
        const emitter = new ApplicationReadyState(readyStateEmitters);
        return emitter;
    }
}
exports.ApplicationReadyState = ApplicationReadyState;
//# sourceMappingURL=application-ready-state.js.map