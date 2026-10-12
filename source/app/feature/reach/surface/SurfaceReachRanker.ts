import type { SurfaceReach } from "./SurfaceReach";

export class SurfaceReachRanker {
    public rank(surfaces: readonly SurfaceReach[]): SurfaceReach[] {
        return [...surfaces].sort(
            (first: SurfaceReach, second: SurfaceReach) =>
                this.weightOf(second.getStars()) - this.weightOf(first.getStars()) ||
                this.weightOf(second.getDownloads()) - this.weightOf(first.getDownloads())
        );
    }

    private weightOf(value: number | null): number {
        return value ?? -1;
    }
}
