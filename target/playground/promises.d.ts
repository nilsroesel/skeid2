declare class OptionalPromise<T> extends Promise<T> {
    static of<T>(value: T | Promise<T>): OptionalPromise<T>;
    private constructor();
    filter(predicate: (value: T) => boolean): OptionalPromise<T>;
    map<R>(mapper: (value: T) => R): OptionalPromise<R>;
    ifPresent(action: (value: T) => void): void;
}
declare class ArrayPromise<T> extends Promise<T> {
    static of<T>(value: Array<T> | Promise<Array<T>>): ArrayPromise<T>;
    private constructor();
    filter(predicate: (item: T, index?: number, array?: Array<T>) => boolean): ArrayPromise<T>;
    map<R>(mapper: (item: T, index?: number, array?: Array<T>) => R): ArrayPromise<R>;
    reduce<R>(reducer: (accumulator: R, current: T, index?: number, array?: Array<T>) => R, initializer?: R): Promise<R>;
}
declare const arrPromise: Promise<number[]>;
