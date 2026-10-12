export class SearchCursor {
    public moved(at: number, by: number, count: number): number {
        if (count <= 0) {
            return at;
        }

        return (at + by + count) % count;
    }
}
