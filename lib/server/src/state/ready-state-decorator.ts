import { applicationContext } from '../../../injection/src/appplication-context';
import { ReadyStateEmitter } from './ready-state-emitter';
import { InvalidInstanceOnFiledError } from '../../../configuration/error';
import { Instantiable } from '../../../global-types';

export function ReadyState( target: any, emitterName: string ) {
    classFieldReadyStateEmitterComposer.incrementTargetedEmitterCount();
    classFieldReadyStateEmitterComposer.addEmitter(target.constructor, emitterName);
}

class ClassFieldReadyStateEmitterComposer {
    private targetEmitterCount: number = 0;

    private registeredEmitters: Array<ReadyStateEmitter> = new Array<ReadyStateEmitter>();

    public addEmitter( dependencyName: Instantiable<any>, fieldName: string ): void {
        applicationContext.whenLoaded(() => {
            applicationContext.loadDependency(dependencyName).then((component: any) => {
                const emitter: unknown = component[fieldName];
                if ( !(emitter instanceof ReadyStateEmitter) ) {
                    throw new InvalidInstanceOnFiledError(dependencyName.name, fieldName, ReadyStateEmitter.name);
                }
                this.registeredEmitters.push(emitter);
            });
        });
    }

    public incrementTargetedEmitterCount() {
        ++this.targetEmitterCount;
    }

    public composeRegisteredEmitters(): ReadyStateEmitter | never {
        if ( this.registeredEmitters.length < this.targetEmitterCount ) {
            throw new Error(`Tried to compose ${ this.registeredEmitters.length} emitters,` +
                `but ${ this.targetEmitterCount } where targeted.`);
        }
        return ReadyStateEmitter.compose(...this.registeredEmitters);
    }
}

export const classFieldReadyStateEmitterComposer: ClassFieldReadyStateEmitterComposer
    = new ClassFieldReadyStateEmitterComposer();
