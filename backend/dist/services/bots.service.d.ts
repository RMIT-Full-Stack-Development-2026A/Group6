interface BotRequest {
    state: {
        player: string[];
        bot: string[];
    };
    latestMove?: string;
    tableSize?: number;
}
declare function computeMove(difficulty: string, payload: BotRequest): Promise<string | null>;
declare const _default: {
    computeMove: typeof computeMove;
};
export default _default;
