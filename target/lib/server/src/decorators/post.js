"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_mapping_1 = require("./rest-mapping");
function Post(route) {
    return rest_mapping_1.RestMapping(Post, route, 'POST');
}
exports.Post = Post;
//# sourceMappingURL=post.js.map