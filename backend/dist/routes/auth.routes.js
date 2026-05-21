"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const router = express_1.default.Router();
router.post('/signup', auth_controller_1.default.signup);
router.post('/login', rateLimiter_middleware_1.authLimiter, auth_controller_1.default.login);
router.post('/logout', auth_controller_1.default.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map