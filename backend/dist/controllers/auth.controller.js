"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    async signup(req, res) {
        try {
            const { email, password, username, country } = req.body;
            const result = await auth_service_1.default.signup({ email, password, username, country });
            res.status(201).json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Signup failed';
            res.status(400).json({ message });
        }
    }
    async login(req, res) {
        try {
            const { usernameOrEmail, identifier, email, username, password } = req.body;
            const loginIdentifier = usernameOrEmail || identifier || email || username;
            const result = await auth_service_1.default.login({ usernameOrEmail: loginIdentifier, password });
            res.status(200).json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            res.status(400).json({ message });
        }
    }
    async logout(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
            if (!token) {
                res.status(400).json({ message: 'Authorization header is required for logout' });
                return;
            }
            await auth_service_1.default.logout(token);
            res.status(200).json({ message: 'Logout successful' });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Logout failed';
            res.status(400).json({ message });
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map