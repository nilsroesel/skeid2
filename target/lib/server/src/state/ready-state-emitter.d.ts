export declare class ReadyStateEmitter {
    static compose(...emitters: Array<ReadyStateEmitter>): ReadyStateEmitter;
    private emitter;
    private state;
    constructor();
    getReadyState(): boolean;
    changeStateToReady(): void;
    whenReady(callback: Function): void;
}
