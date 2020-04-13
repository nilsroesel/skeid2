import { SpecifiedPathParameterHasNoNameError } from '../../../configuration/error';

export class RoutePart {

    public static constructFromString( part: string ): RoutePart | never {
        if ( part === null || part === undefined ) {
            throw new TypeError(`Invalid argument. Expected [string], but got: [${ part }]`);
        }

        if ( part.startsWith('{') && part.length <= 3 && part.endsWith('}') ) {
            throw new SpecifiedPathParameterHasNoNameError();
        }
        return new RoutePart(part);
    }

    private constructor( private part: string ) {}

    public matchesSplitedUrlPart( urlPart: string ) {
        if ( this.isPathVariable() ) {
            return true;
        }
        return urlPart === this.part;
    }

    public getPart(): string {
        return this.part;
    }

    public isPathVariable(): boolean {
        return this.part.startsWith('{') && this.part.endsWith('}');
    }

    public getName(): string {
        if ( !this.isPathVariable() ) return this.getPart();
        return this.part.slice(1, this.part.length - 1);
    }

}
