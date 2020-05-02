import { ReadyStateEmitter } from './ready-state-emitter';
export declare abstract class PristineReadyStateEmitter extends ReadyStateEmitter {
    private pristine;
    changeToStale(): void;
    isPristine(): boolean;
    abstract getSelfAndSetToReadyIfPristineAfterInit(): PristineReadyStateEmitter;
}
