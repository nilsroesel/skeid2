"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
function mockUrl(path) {
    return new url_1.URL('http://www.foo.de' + path);
}
exports.mockUrl = mockUrl;
//# sourceMappingURL=helpers.js.map