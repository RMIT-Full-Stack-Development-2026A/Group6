"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default, (0, role_middleware_1.default)('admin'));
router.get('/users', admin_controller_1.default.getAllUsers.bind(admin_controller_1.default));
router.get('/users/:id', admin_controller_1.default.getUserById.bind(admin_controller_1.default));
router.patch('/users/:id/deactivate', admin_controller_1.default.deactivateUser.bind(admin_controller_1.default));
router.patch('/users/:id/reactivate', admin_controller_1.default.reactivateUser.bind(admin_controller_1.default));
exports.default = router;
//# sourceMappingURL=admin.routes.js.map