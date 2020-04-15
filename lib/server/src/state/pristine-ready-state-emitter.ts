import { ReadyStateEmitter } from './ready-state-emitter';

export abstract class PristineReadyStateEmitter extends ReadyStateEmitter {

    private pristine: boolean = true;

    public changeToStale(): void {
        this.pristine = false;
    }

    public isPristine(): boolean {
        return this.pristine;
    }

    public abstract getSelfAndSetToReadyIfPristineAfterInit(): PristineReadyStateEmitter;

}
