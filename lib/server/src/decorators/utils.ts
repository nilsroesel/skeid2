export function decoratedItemIsMethod( something: unknown ): something is Function {
    return typeof something === 'function';
}

export function copyMetadata( from: any, to: any ): void {
    Reflect.getOwnMetadataKeys(from).forEach(metadataKey => {
       const metadata: any = Reflect.getOwnMetadata(metadataKey, from);
       Reflect.defineMetadata(metadataKey, metadata, to);
    });
}
