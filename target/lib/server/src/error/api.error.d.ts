export declare class ApiError extends Error implements HttpStatus {
    readonly code: number;
    readonly message: string;
    constructor(code: number, message: string);
    get name(): string;
}
export interface HttpStatus {
    code: number;
    message: string;
}
