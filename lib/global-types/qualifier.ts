export type Qualifier = string | symbol;

export function isQualifier( something: unknown ): something is Qualifier {
    const type = typeof something;
    return type === 'string' || type === 'symbol';
}
