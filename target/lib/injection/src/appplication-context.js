"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const events_1 = require("events");
class ApplicationContextImpl {
    constructor() {
        this.dependencyToInjectionsMap = new Map();
        this.dependencyRegistry = {};
        this.afterLoadRegistry = [];
        this.loadedEvent = new events_1.EventEmitter();
    }
    add(dependency, on) {
        const list = this.dependencyToInjectionsMap.get(dependency) || [];
        list.push(on);
        this.dependencyToInjectionsMap.set(dependency, list);
    }
    addAfterLoad(dependency, methodName) {
        this.afterLoadRegistry.push({ dependency, methodName });
    }
    registerDependency(clazz, qualifier) {
        const dependencyName = !!qualifier ? qualifier : clazz.name;
        this.dependencyRegistry[dependencyName] = new clazz();
    }
    loadDependency(Dependency) {
        return new Promise((resolve, reject) => {
            if (!Object.getOwnPropertyDescriptor(ApplicationContextImpl, 'INITIALIZED')) {
                reject(new Error('Application Context is not loaded yet.'));
            }
            if (!this.dependencyRegistry[Dependency.name]) {
                reject(new Error(`No dependency <<${Dependency.name}>> found.`));
            }
            if (!(this.dependencyRegistry[Dependency.name] instanceof Dependency)) {
                reject(new Error(`Dependency <<${Dependency.name}>> is no valid instance of the desired type.`));
            }
            resolve(this.dependencyRegistry[Dependency.name]);
        });
    }
    load(EntryClass) {
        return new Promise(resolve => {
            const resolveAndEmit = (component) => {
                this.loadedEvent.emit('loaded');
                this.loadedEvent.removeAllListeners();
                this.executeAfterLoads();
                resolve(component);
            };
            Object.defineProperty(ApplicationContextImpl, 'INITIALIZED', {
                value: true, writable: false, configurable: false
            });
            this.dependencyToInjectionsMap.forEach((value, dependency) => {
                if (!this.dependencyRegistry[dependency]) {
                    throw new Error(`Unsatisfied dependency ${dependency}`);
                }
                value.forEach((v) => {
                    Object.defineProperty(v.target, v.key, {
                        value: this.dependencyRegistry[dependency],
                        writable: false,
                        configurable: false
                    });
                });
            });
            if (EntryClass !== undefined) {
                this.loadDependency(EntryClass).then(resolveAndEmit);
            }
            else {
                resolveAndEmit();
            }
        });
    }
    whenLoaded(callback) {
        if (Object.getOwnPropertyDescriptor(ApplicationContextImpl, 'INITIALIZED')) {
            callback();
            return;
        }
        this.loadedEvent.addListener('loaded', callback);
    }
    executeAfterLoads() {
        this.afterLoadRegistry.forEach(registeredAfterLoad => {
            var _a;
            const createdDependency = this.dependencyRegistry[registeredAfterLoad.dependency.name];
            if (createdDependency === undefined) {
                throw new TypeError('Dependency instance is undefined');
            }
            (_a = createdDependency[registeredAfterLoad.methodName]) === null || _a === void 0 ? void 0 : _a.apply(createdDependency);
        });
    }
}
const modifiableApplicationContext = new ApplicationContextImpl();
exports.modifiableApplicationContext = modifiableApplicationContext;
const applicationContext = {
    load: function (EntryClass) {
        return modifiableApplicationContext.load(EntryClass);
    },
    loadDependency: function (Dependency) {
        return modifiableApplicationContext.loadDependency(Dependency);
    },
    whenLoaded: function (callback) {
        modifiableApplicationContext.whenLoaded(callback);
    }
};
exports.applicationContext = applicationContext;
//# sourceMappingURL=appplication-context.js.map