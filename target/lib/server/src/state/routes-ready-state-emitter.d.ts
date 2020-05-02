import { PristineReadyStateEmitter } from './pristine-ready-state-emitter';
declare class RoutesReadyStateEmitter extends PristineReadyStateEmitter {
    private targetNumberOfRoutes;
    private initializedRoutes;
    getSelfAndSetToReadyIfPristineAfterInit(): RoutesReadyStateEmitter;
    incrementTargetNumberOfRoutes(): void;
    incrementInitializedRoutes(): void;
    initializeRoute<T>(decorator: Function, httpMethod: string, route: string, target: any, methodName: string): void;
}
export declare const routesReadyState: RoutesReadyStateEmitter;
export {};
