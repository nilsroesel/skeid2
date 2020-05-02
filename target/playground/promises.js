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
class OptionalPromise extends Promise {
    static of(value) {
        // @ts-ignore
        return new OptionalPromise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (value instanceof Promise)
                return value.then(v => resolve(v));
            return resolve(value);
        }));
    }
    // @ts-ignore
    constructor(arg) {
        super(arg);
    }
    filter(predicate) {
        // @ts-ignore
        return new OptionalPromise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const rawValue = yield this.then();
            if (rawValue === null || rawValue === undefined)
                return resolve();
            if (predicate(rawValue))
                return resolve(rawValue);
            else
                return resolve();
        }));
    }
    map(mapper) {
        // @ts-ignore
        return new OptionalPromise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const mapperResult = yield this.then(v => mapper(v));
            return resolve(mapperResult);
        }));
    }
    ifPresent(action) {
        this.then(v => {
            if (v !== undefined && v !== null)
                action(v);
        });
    }
}
class ArrayPromise extends Promise {
    static of(value) {
        // @ts-ignore
        return new ArrayPromise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (value instanceof Promise)
                return value.then(v => resolve(v));
            return resolve(value);
        }));
    }
    // @ts-ignore
    constructor(arg) {
        super(arg);
    }
    filter(predicate) {
        // @ts-ignore
        return new ArrayPromise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const array = yield this.then();
            resolve(array.filter(v => predicate(v)));
        }));
    }
    map(mapper) {
        // @ts-ignore
        return new ArrayPromise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const array = yield this.then();
            resolve(array.map(v => mapper(v)));
        }));
    }
    reduce(reducer, initializer) {
        // @ts-ignore
        return new ArrayPromise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const array = yield this.then();
            if (initializer === undefined)
                // @ts-ignore
                return resolve(array.reduce((a, c, i, arr) => reducer(a, c, i, arr)));
            return resolve(array.reduce((a, c, i, arr) => reducer(a, c, i, arr), initializer));
            ;
        })).then();
    }
}
OptionalPromise.of(1)
    .map(v => v + 1)
    .filter(v => v > 1)
    .ifPresent(value => console.log('Of simple', value));
OptionalPromise.of(Promise.resolve().then(() => 1))
    .map(v => v + 1)
    .filter(v => v > 1)
    .ifPresent(value => console.log('Of promise', value));
const arrPromise = Promise.resolve().then(() => [1, 2, 3, 4]);
ArrayPromise.of(arrPromise).filter(v => v % 2 === 0).map(v => v + 1).then(console.log);
// @ts-ignore
ArrayPromise.of(arrPromise).reduce((acc, curr) => acc + curr).then(console.log);
//# sourceMappingURL=promises.js.map