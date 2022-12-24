"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfUser = void 0;
function instanceOfUser(object) {
    return 'member' in object;
}
exports.instanceOfUser = instanceOfUser;
