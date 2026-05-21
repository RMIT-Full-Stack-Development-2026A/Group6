"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bots_service_1 = __importDefault(require("../services/bots.service"));
class BotsController {
    async getMove(req, res) {
        try {
            const difficulty = String(req.params.difficulty || "medium");
            // Accept body for GET (some clients may send JSON in GET), but also allow query
            const payload = req.body && Object.keys(req.body).length ? req.body : {
                state: req.query.state ? JSON.parse(String(req.query.state)) : undefined,
                latestMove: req.query.latestMove,
                tableSize: req.query.tableSize ? Number(req.query.tableSize) : undefined,
            };
            const move = await bots_service_1.default.computeMove(difficulty, payload);
            res.status(200).json({ success: true, data: { move } });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : "An error occurred" });
        }
    }
}
exports.default = new BotsController();
//# sourceMappingURL=bots.controller.js.map