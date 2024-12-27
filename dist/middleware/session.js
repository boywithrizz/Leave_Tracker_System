"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const sessions = {};
const sessionMiddleware = (ctx, next) => {
    var _a;
    const userId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (userId) {
        ctx.session = sessions[userId] || {};
    }
    return next().then(() => {
        if (userId) {
            sessions[userId] = ctx.session;
        }
    });
};
exports.sessionMiddleware = sessionMiddleware;
