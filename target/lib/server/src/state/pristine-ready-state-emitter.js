"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ready_state_emitter_1 = require("./ready-state-emitter");
class PristineReadyStateEmitter extends ready_state_emitter_1.ReadyStateEmitter {
    constructor() {
        super(...arguments);
        this.pristine = true;
    }
    changeToStale() {
        this.pristine = false;
    }
    isPristine() {
        return this.pristine;
    }
}
exports.PristineReadyStateEmitter = PristineReadyStateEmitter;
//# sourceMappingURL=pristine-ready-state-emitter.js.map