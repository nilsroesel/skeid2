"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_mapping_1 = require("./rest-mapping");
function Get(route) {
    return rest_mapping_1.RestMapping(Get, route, 'GET');
}
exports.Get = Get;
//# sourceMappingURL=get.js.map