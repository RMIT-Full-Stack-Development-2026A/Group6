"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
const router = (0, express_1.Router)();
router.get('/profile', auth_middleware_1.default, (req, res) => user_controller_1.default.getProfile(req, res));
router.put('/profile', auth_middleware_1.default, (req, res) => user_controller_1.default.updateProfile(req, res));
router.put('/password', auth_middleware_1.default, (req, res) => user_controller_1.default.updatePassword(req, res));
router.get('/', auth_middleware_1.default, (0, role_middleware_1.default)('admin'), (req, res) => user_controller_1.default.getAllUsers(req, res));
router.get('/:id', auth_middleware_1.default, (0, role_middleware_1.default)('admin'), (req, res) => user_controller_1.default.getUserById(req, res));
router.delete('/:id', auth_middleware_1.default, (0, role_middleware_1.default)('admin'), (req, res) => user_controller_1.default.deleteUser(req, res));
router.put('/:id/subscription', auth_middleware_1.default, (0, role_middleware_1.default)('admin'), (req, res) => user_controller_1.default.assignSubscription(req, res));
exports.default = router;
//# sourceMappingURL=user.routes.js.map