"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const appplication_context_1 = require("../../../injection/src/appplication-context");
const ready_state_emitter_1 = require("./ready-state-emitter");
const error_1 = require("../../../configuration/error");
const pristine_ready_state_emitter_1 = require("./pristine-ready-state-emitter");
function ReadyState(target, emitterName) {
    exports.classFieldReadyStateEmitterComposer.incrementTargetedEmitterCount();
    exports.classFieldReadyStateEmitterComposer.addEmitter(target.constructor, emitterName);
}
exports.ReadyState = ReadyState;
class ClassFieldReadyStateEmitterComposer {
    constructor() {
        this.targetEmitterCount = 0;
        this.registeredEmitters = new Array();
    }
    addEmitter(dependencyName, fieldName) {
        appplication_context_1.applicationContext.whenLoaded(() => __awaiter(this, void 0, void 0, function* () {
            const component = yield appplication_context_1.applicationContext.loadDependency(dependencyName);
            const emitter = component[fieldName];
            if (!(emitter instanceof ready_state_emitter_1.ReadyStateEmitter)) {
                throw new error_1.InvalidInstanceOnFiledError(dependencyName.name, fieldName, ready_state_emitter_1.ReadyStateEmitter.name);
            }
            this.registeredEmitters.push(emitter);
        }));
    }
    incrementTargetedEmitterCount() {
        ++this.targetEmitterCount;
    }
    composeRegisteredEmitters() {
        if (this.registeredEmitters.length < this.targetEmitterCount) {
            throw new Error(`Tried to compose ${this.registeredEmitters.length} emitters,` +
                `but ${this.targetEmitterCount} where targeted.`);
        }
        return ready_state_emitter_1.ReadyStateEmitter.compose(...this.registeredEmitters.map(emitter => {
            if (emitter instanceof pristine_ready_state_emitter_1.PristineReadyStateEmitter) {
                return emitter.getSelfAndSetToReadyIfPristineAfterInit();
            }
            return emitter;
        }));
    }
}
exports.classFieldReadyStateEmitterComposer = new ClassFieldReadyStateEmitterComposer();
//# sourceMappingURL=ready-state-decorator.js.map