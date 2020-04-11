export function decoratedItemIsMethod( something: unknown ): something is Function {
    return typeof something === 'function';
}
