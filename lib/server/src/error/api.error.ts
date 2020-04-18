export class ApiError extends Error implements HttpStatus {
    constructor( public readonly code: number, public readonly message: string ) {
        super();
    }

    get name(): string {
        return (this as any).constructor.name
    }
}

export interface HttpStatus {
    code: number;
    message: string;
}
