export function inBounds(r: number, c: number, size: number): boolean {
    return r >= 0 && c >= 0 && r < size && c < size;
}
