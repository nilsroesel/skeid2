export function decoratedItemIsMethod( something: unknown ): something is Function {
    return typeof something === 'function';
}

export function copyMetadata( from: any, to: any ): void {
    Reflect.getOwnMetadataKeys(from).forEach(metadataKey => {
       const metadata: any = Reflect.getOwnMetadata(metadataKey, from);
       Reflect.defineMetadata(metadataKey, metadata, to);
    });
}

export function getNameOfParameter( ofFunction: Function, parameterIndex: number ): string | never {
    const functionString = ofFunction.toString();
    const indexOfOpeningBrace = functionString.indexOf('(') + 1;
    const indexOfClosingBrace = functionString.indexOf(')');
    const argumentContent = functionString.slice(indexOfOpeningBrace, indexOfClosingBrace);
    const parameterNames = argumentContent.split(' ').map(name => name.replace(',', ''));
    const parameterNameAtIndex = parameterNames[parameterIndex];

    if ( parameterNameAtIndex === undefined ) throw new Error('No parameter on this index');
    const isRestOperatorArgument = parameterNameAtIndex.startsWith('...');
    if ( isRestOperatorArgument ) throw new Error('Rest Operator is not supported');

    return parameterNameAtIndex;
}

export function getParameterIndex( from: Function, parameterName: string ): number | undefined {
    return Reflect.getMetadata(parameterName, from);
}

export function registerParameterIndexInMetadata( on: Function, parameterName: string, index: number ): void {
    Reflect.defineMetadata(parameterName, index, on);
}
