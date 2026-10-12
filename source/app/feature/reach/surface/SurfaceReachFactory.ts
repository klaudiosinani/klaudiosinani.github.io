import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";
import { SurfaceReach } from "./SurfaceReach";

export class SurfaceReachFactory {
    private readonly FEWEST_DEPENDENTS: number = 1000;
    private readonly FEWEST_DOWNLOADS: number = 10000;
    private readonly WINDOW_WEEKS: number = 2;
    private readonly YEAR_WEEKS: number = 52;

    public create(repositoryProfile: RepositoryProfile, name: string, note: string, href: string): SurfaceReach {
        const downloads: number | null = this.plentiful(this.counted(repositoryProfile.downloads.getTotal()));

        return new SurfaceReach(
            name,
            note,
            href,
            this.counted(repositoryProfile.stars),
            downloads,
            this.impressive(repositoryProfile.dependents?.getRepositories() ?? null),
            downloads === null ? this.yearly(this.counted(repositoryProfile.clones)) : null
        );
    }

    private plentiful(value: number | null): number | null {
        return value !== null && value >= this.FEWEST_DOWNLOADS ? value : null;
    }

    private yearly(value: number | null): number | null {
        return value !== null ? Math.round((value * this.YEAR_WEEKS) / this.WINDOW_WEEKS) : null;
    }

    private impressive(value: number | null): number | null {
        return value !== null && value >= this.FEWEST_DEPENDENTS ? value : null;
    }

    private counted(value: number | null): number | null {
        return value !== null && value > 0 ? value : null;
    }
}
