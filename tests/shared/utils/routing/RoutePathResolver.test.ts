import { describe, expect, it } from "vitest";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver";
import { ROUTES } from "@app/configuration/Routes";

const underTest: typeof RoutePathResolver = RoutePathResolver;

describe("RoutePathResolver.publication", () => {
    it("givenAPublicationSlug_whenResolvingItsPagePath_thenATrailingSlashUrlIsBuilt", () => {
        const slug: string = "a-post";

        const path: string = underTest.resolvePublication(slug);

        expect(path).toBe("/publications/a-post/");
    });

    it("givenAPublicationSlug_whenResolvingItsPagePath_thenTheRouteComesFromConfiguration", () => {
        const slug: string = "a-post";

        const path: string = underTest.resolvePublication(slug);

        expect(path).toContain(ROUTES.publications);
    });
});

describe("RoutePathResolver.tag", () => {
    it("givenATagSlug_whenResolvingItsIndexPath_thenItSitsUnderTheTagsRoute", () => {
        const tag: string = "linux";

        const path: string = underTest.resolveTag(tag);

        expect(path).toBe("/index/linux");
    });

    it("givenATagSlug_whenResolvingItsIndexPath_thenNoTrailingSlashBlocksPagination", () => {
        const tag: string = "linux";

        const path: string = underTest.resolveTag(tag);

        expect(path.endsWith("/")).toBe(false);
        expect(`${path}/2`).toBe("/index/linux/2");
    });
});

describe("RoutePathResolver.publicationImage", () => {
    it("givenAPublicationSlug_whenResolvingItsImagePath_thenItMatchesTheGeneratedEndpoint", () => {
        const slug: string = "a-post";

        const path: string = underTest.resolvePublicationImage(slug);

        expect(path).toBe("/publications/a-post.png");
    });

    it("givenAPublicationSlug_whenResolvingItsImagePath_thenThePagePathIsNotReused", () => {
        const slug: string = "a-post";

        const path: string = underTest.resolvePublicationImage(slug);

        expect(path).not.toContain("/.png");
    });
});

describe("RoutePathResolver.resolveRepository", () => {
    it("givenARepositoryName_whenResolving_thenItSitsAtTheRootOfTheSite", () => {
        expect(underTest.resolveRepository("signale")).toBe("/signale/");
    });

    it("givenAResolvedPath_whenReadingIt_thenItEndsInASlashAsEveryOtherRouteDoes", () => {
        expect(underTest.resolveRepository("hyper-pokemon")).toBe("/hyper-pokemon/");
    });
});

describe("RoutePathResolver.resolveRepositoryImage", () => {
    it("givenARepositoryName_whenResolving_thenItPointsAtTheShareCardBesideThePage", () => {
        expect(underTest.resolveRepositoryImage("signale")).toBe("/signale.png");
    });
});

describe("RoutePathResolver.resolvePageImage", () => {
    it("givenTheKeyOfAPage_whenResolving_thenItPointsAtTheCardOfThatPage", () => {
        expect(underTest.resolvePageImage("software")).toBe("/og/software.png");
    });
});

describe("RoutePathResolver.resolveTagImage", () => {
    it("givenAKeyword_whenResolving_thenItsCardIsNamedApartFromThePages", () => {
        expect(underTest.resolveTagImage("about")).toBe("/og/tag-about.png");
    });

    it("givenAKeyword_whenNamingItsCard_thenTheRouteReadsTheSameKeyBack", () => {
        expect(underTest.resolvePageImage(underTest.tagImageKey("java"))).toBe(underTest.resolveTagImage("java"));
    });
});

describe("RoutePathResolver.resolveRelease", () => {
    it("givenAProjectAndAVersion_whenResolving_thenTheNotesSitUnderTheProject", () => {
        expect(underTest.resolveRelease("signale", "v4.2.0")).toBe("/signale/releases/v4.2.0/");
    });
});

describe("RoutePathResolver.resolveLatestRelease", () => {
    it("givenAProject_whenResolving_thenTheNewestReleaseHasAnAddressThatHolds", () => {
        expect(underTest.resolveLatestRelease("signale")).toBe("/signale/releases/latest/");
    });
});

describe("RoutePathResolver.resolveRepositoryReleases", () => {
    it("givenAProject_whenResolving_thenItsReleasesSitUnderTheProject", () => {
        expect(underTest.resolveRepositoryReleases("signale")).toBe("/signale/releases/");
    });
});

describe("RoutePathResolver.resolveRepositoryManual", () => {
    it("givenAProject_whenResolving_thenItsManualSitsUnderTheProject", () => {
        expect(underTest.resolveRepositoryManual("signale")).toBe("/signale/documentation/");
    });
});

describe("RoutePathResolver.resolveContributions", () => {
    it("givenACodebaseOfSomebodyElse_whenResolved_thenItStandsUnderTheRecord", () => {
        expect(underTest.resolveContributions("sonarqube")).toBe("/experience/sonarqube/");
    });

    it("givenTheSamePlace_whenResolvedForPaging_thenItCarriesNoClosingStroke", () => {
        expect(underTest.resolveContributionsBase("sonarqube")).toBe("/experience/sonarqube");
    });
});
