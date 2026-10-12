export class NearestNameResolver {
    private readonly FURTHEST: number = 3;

    public resolve(candidate: string, names: readonly string[]): string | null {
        const wanted: string = candidate.toLowerCase();

        if (wanted.length === 0) {
            return null;
        }

        let nearest: string | null = null;
        let shortest: number = this.FURTHEST + 1;

        for (const name of names) {
            const distance: number = this.distance(wanted, name.toLowerCase());

            if (distance < shortest) {
                shortest = distance;
                nearest = name;
            }
        }

        return shortest <= this.FURTHEST ? nearest : null;
    }

    private distance(from: string, to: string): number {
        let previous: number[] = Array.from({ length: to.length + 1 }, (_: unknown, index: number) => index);

        for (let row: number = 1; row <= from.length; row++) {
            const current: number[] = [row];

            for (let column: number = 1; column <= to.length; column++) {
                const substitution: number = previous[column - 1] + (from[row - 1] === to[column - 1] ? 0 : 1);

                current[column] = Math.min(substitution, previous[column] + 1, current[column - 1] + 1);
            }

            previous = current;
        }

        return previous[to.length];
    }
}
