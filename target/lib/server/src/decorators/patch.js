"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_mapping_1 = require("./rest-mapping");
function Patch(route) {
    return rest_mapping_1.RestMapping(Patch, route, 'PATCH');
}
exports.Patch = Patch;
//# sourceMappingURL=patch.js.map