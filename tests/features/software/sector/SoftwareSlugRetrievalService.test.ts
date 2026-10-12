import { describe, expect, it } from "vitest";
import type { FeaturedSoftware } from "@app/feature/software/featured/FeaturedSoftware";
import { RepositoryNameResolver } from "@app/util/routing/RepositoryNameResolver";
import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";
import type { SectorKey } from "@app/configuration/sector/SectorKey";
import { SoftwareSlugRetrievalService } from "@app/feature/software/sector/SoftwareSlugRetrievalService";

describe("SoftwareSlugRetrievalService", () => {
    const softwareOf = (url: string, order: number, sector: SectorKey, featured: boolean): FeaturedSoftware => ({
        name: url,
        logline: "",
        description: "",
        url,
        order,
        sector,
        featured,
    });
    const featuredSoftwareRetrievalService: RetrievalService<FeaturedSoftware> = {
        retrieve: async (): Promise<FeaturedSoftware[]> => [
            softwareOf("https://github.com/klaudiosinani/signale", 2, "open-source", true),
            softwareOf("https://github.com/klaudiosinani/hyper-pokemon", 4, "open-source", false),
            softwareOf("https://github.com/klaudiosinani/moviebox", 3, "academic", true),
            softwareOf("https://github.com/klaudiosinani/taskbook", 1, "open-source", true),
        ],
    };
    const softwareSlugRetrievalService: SoftwareSlugRetrievalService = new SoftwareSlugRetrievalService(
        featuredSoftwareRetrievalService,
        new RepositoryNameResolver()
    );

    it("givenTheOpenSourceSector_whenRetrieving_thenItsFeaturedSlugsComeInTheirOrder", async () => {
        expect(await softwareSlugRetrievalService.retrieve("open-source")).toEqual(["taskbook", "signale"]);
    });

    it("givenTheAcademicSector_whenRetrieving_thenOnlyItsSlugsCome", async () => {
        expect(await softwareSlugRetrievalService.retrieve("academic")).toEqual(["moviebox"]);
    });

    it("givenASectorWithNoSoftware_whenRetrieving_thenNoSlugComes", async () => {
        expect(await softwareSlugRetrievalService.retrieve("experience")).toEqual([]);
    });
});
