import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import type { FeaturedSoftware } from "@app/feature/software/FeaturedSoftware";
import { ProfileCollectionService } from "@app/feature/repository/service/ProfileCollectionService";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import { RepositoryProfileRetrievalService } from "@app/feature/repository/service/RepositoryProfileRetrievalService";
import type { RetrievalService } from "@app/infrastructure/RetrievalService";

vi.mock("astro:content", () => ({ getCollection: vi.fn() }));

const repository = (name: string): RepositoryData => ({ name, description: "", url: "" }) as RepositoryData;

const listing = <T>(items: T[]): RetrievalService<T> => ({
    retrieve: () => Promise.resolve(items),
});

const profile = (slug: string): RepositoryProfile =>
    ({
        slug,
        name: slug,
        releases: [],
        languages: [],
        packages: [],
        topics: [],
    }) as unknown as RepositoryProfile;

describe("ProfileCollectionService.retrieve", () => {
    it("givenTheRepositories_whenRetrieving_thenEachProfiledOneIsGiven", async () => {
        const retrieve: Mock<(name: string) => Promise<RepositoryProfile | null>> = vi.fn((name: string) =>
            Promise.resolve(profile(name))
        );

        vi.spyOn(RepositoryProfileRetrievalService, "shared").mockReturnValue({
            retrieve,
        } as unknown as ReturnType<typeof RepositoryProfileRetrievalService.shared>);

        const underTest: ProfileCollectionService = new ProfileCollectionService(
            listing([repository("signale"), repository("taskbook")]),
            listing<FeaturedSoftware>([])
        );

        const profiles: RepositoryProfile[] = await underTest.retrieve();

        expect(profiles.map(({ slug }: RepositoryProfile) => slug)).toEqual(["signale", "taskbook"]);
    });

    it("givenAProfileThatCouldNotBeRead_whenRetrieving_thenItIsLeftOut", async () => {
        vi.spyOn(RepositoryProfileRetrievalService, "shared").mockReturnValue({
            retrieve: vi.fn(() => Promise.resolve(null)),
        } as unknown as ReturnType<typeof RepositoryProfileRetrievalService.shared>);

        const underTest: ProfileCollectionService = new ProfileCollectionService(
            listing([repository("signale")]),
            listing<FeaturedSoftware>([])
        );

        expect(await underTest.retrieve()).toEqual([]);
    });
});
