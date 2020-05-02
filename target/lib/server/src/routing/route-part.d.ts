export declare class RoutePart {
    private part;
    static constructFromString(part: string): RoutePart | never;
    private constructor();
    matchesSplitedUrlPart(urlPart: string): boolean;
    getPart(): string;
    isPathVariable(): boolean;
    getName(): string;
}
