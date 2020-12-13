export interface AuthorizationConfiguration {
    resolveScopes( ... args: any[] ): Array<string> | never;
}
