export class ApiError extends Error implements HttpStatus {
    constructor( public readonly code: number, public readonly message: string ) {
        super(`Error: ${ code } - ${ message }`);
    }
}

export interface HttpStatus {
    code: number;
    message: string;
}
