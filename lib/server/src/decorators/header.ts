import 'reflect-metadata';

import {
    handleAsFactory
} from './utils';
import { Maybe } from '../../../global-types';

const namespace = 'header:';

export function Header( name: string, serializer?: Maybe<Function>): any {
    return handleAsFactory(namespace, name.toLowerCase(), serializer as Maybe<Function | string>);
}
