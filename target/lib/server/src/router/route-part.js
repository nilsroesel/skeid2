"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../../configuration/error");
class RoutePart {
    constructor(part) {
        this.part = part;
    }
    static constructFromString(part) {
        if (part === null || part === undefined) {
            throw new TypeError(`Invalid argument. Expected [string], but got: [${part}]`);
        }
        if (part.startsWith('{') && part.length <= 3 && part.endsWith('}')) {
            throw new error_1.SpecifiedPathParameterHasNoNameError();
        }
        return new RoutePart(part);
    }
    matchesSplitedUrlPart(urlPart) {
        if (this.isPathVariable()) {
            return true;
        }
        return urlPart === this.part;
    }
    getPart() {
        if (this.isPathVariable()) {
            return this.part.slice(1);
        }
        return this.part;
    }
    isPathVariable() {
        return this.part.startsWith('{') && this.part.endsWith('}');
    }
}
exports.RoutePart = RoutePart;
//# sourceMappingURL=route-part.js.map