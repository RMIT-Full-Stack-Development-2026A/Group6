"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const bots_routes_1 = __importDefault(require("./routes/bots.routes"));
const game_routes_1 = __importDefault(require("./routes/game.routes"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/avatars', express_1.default.static(path_1.default.join(__dirname, '../public/avatars')));
(0, db_1.default)();
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/subscriptions', subscription_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/bots', bots_routes_1.default);
app.use('/api/games', game_routes_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});
app.get('/api/db-status', (_req, res) => {
    const isConnected = mongoose_1.default.connection.readyState === 1;
    res.json({
        database: 'MongoDB',
        connected: isConnected,
        status: isConnected ? 'Connected' : 'Disconnected',
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map