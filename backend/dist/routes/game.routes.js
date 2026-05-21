"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const game_controller_1 = __importDefault(require("../controllers/game.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const premium_middleware_1 = __importDefault(require("../middleware/premium.middleware"));
const router = (0, express_1.Router)();
router.get('/my', auth_middleware_1.default, (req, res) => game_controller_1.default.getMyGames(req, res));
router.get('/my/stats', auth_middleware_1.default, (req, res) => game_controller_1.default.getMyStats(req, res));
router.post('/', auth_middleware_1.default, (req, res) => game_controller_1.default.create(req, res));
router.get('/', auth_middleware_1.default, (req, res) => game_controller_1.default.getAll(req, res));
router.get('/:id', auth_middleware_1.default, (req, res) => game_controller_1.default.getById(req, res));
// Premium-only: fetch full move list for replay
router.get('/:id/moves', auth_middleware_1.default, premium_middleware_1.default, (req, res) => game_controller_1.default.getGameMoves(req, res));
router.put('/:id', auth_middleware_1.default, (req, res) => game_controller_1.default.update(req, res));
router.delete('/:id', auth_middleware_1.default, (req, res) => game_controller_1.default.delete(req, res));
router.post('/:gameId/bot-moves', auth_middleware_1.default, (req, res) => game_controller_1.default.submitBotGameMoves(req, res));
exports.default = router;
//# sourceMappingURL=game.routes.js.map