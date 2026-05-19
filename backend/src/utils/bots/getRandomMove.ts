import { toNotation } from "./toNotation";

export function getRandomMove(size: number): string {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    return toNotation(r, c);
}
