export function toCoord(pos: string): [number, number] {
    const col = pos.charCodeAt(0) - 65;
    const row = parseInt(pos.slice(1), 10) - 1;
    return [row, col];
}
