import { EventEmitter } from 'events';

export class ReadyStateEmitter {

    public static compose( ... emitters: Array<ReadyStateEmitter> ): ReadyStateEmitter {
        const composedEmitter: ReadyStateEmitter = new ReadyStateEmitter();

        emitters.forEach(emitter => {
            emitter.whenReady(() =>{
                const allEmitterStates: Array<boolean> = emitters.map(e => e.getReadyState());
                const allEmittersAreReady: boolean = allEmitterStates.reduce((a, c) => a && c, true);
                if ( allEmittersAreReady ) {
                    composedEmitter.changeStateToReady();
                }
            });
        });

        return composedEmitter;
    }

    private emitter: EventEmitter = new EventEmitter();
    private state: boolean = false;

    constructor() {}

    public getReadyState(): boolean {
        return this.state;
    }

    public changeStateToReady(): void {
        this.state = true;
        this.emitter.emit('ready');
        this.emitter.removeAllListeners();
    }

    public whenReady( callback: Function ): void {
        if ( this.state ) {
            return callback();
        }
        this.emitter.addListener('ready', callback);
    }
}
