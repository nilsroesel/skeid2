import { Instantiable } from '../../../global-types';
import { ReadyStateEmitter } from '../state';
export interface ApplicationConfiguration {
    port: number;
    isReadyWhen: Array<ReadyStateEmitter>;
}
export declare function Application(configuration: Partial<ApplicationConfiguration>): <T>(clazz: Instantiable<T>) => void;
