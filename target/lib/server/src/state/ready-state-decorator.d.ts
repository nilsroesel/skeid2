import { ReadyStateEmitter } from './ready-state-emitter';
import { Instantiable } from '../../../global-types';
export declare function ReadyState(target: any, emitterName: string): void;
declare class ClassFieldReadyStateEmitterComposer {
    private targetEmitterCount;
    private registeredEmitters;
    addEmitter(dependencyName: Instantiable<any>, fieldName: string): void;
    incrementTargetedEmitterCount(): void;
    composeRegisteredEmitters(): ReadyStateEmitter | never;
}
export declare const classFieldReadyStateEmitterComposer: ClassFieldReadyStateEmitterComposer;
export {};
