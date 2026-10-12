import { describe, expect, it } from "vitest";
import { BreadcrumbTrailResolver } from "@app/util/routing/BreadcrumbTrailResolver";

const underTest: typeof BreadcrumbTrailResolver = BreadcrumbTrailResolver;

describe("BreadcrumbTrailResolver.resolve", () => {
    it("givenANestedPathname_whenBuildingTheTrail_thenOneCrumbPerSegmentIsProduced", () => {
        const pathname: string = "/index/gnome";

        const segments: string[] = underTest.resolve(pathname);

        expect(segments).toEqual(["index", "gnome"]);
    });

    it("givenATrailingSlash_whenBuildingTheTrail_thenNoEmptyCrumbIsAppended", () => {
        const pathname: string = "/publications/";

        const segments: string[] = underTest.resolve(pathname);

        expect(segments).toEqual(["publications"]);
    });

    it("givenRepeatedTrailingSlashes_whenBuildingTheTrail_thenTheyCollapse", () => {
        const pathname: string = "/publications///";

        const segments: string[] = underTest.resolve(pathname);

        expect(segments).toEqual(["publications"]);
    });

    it("givenTheSiteRoot_whenBuildingTheTrail_thenNoCrumbsAreProduced", () => {
        const pathname: string = "/";

        const segments: string[] = underTest.resolve(pathname);

        expect(segments).toEqual([]);
    });

    it("givenAPaginatedPathname_whenBuildingTheTrail_thenThePageNumberIsItsOwnCrumb", () => {
        const pathname: string = "/publications/2/";

        const segments: string[] = underTest.resolve(pathname);

        expect(segments).toEqual(["publications", "2"]);
    });
});

describe("BreadcrumbTrailResolver.isTagName", () => {
    it("givenASegmentUnderTheTagsRoute_whenCheckingIfItIsATagName_thenItIsTrue", () => {
        const segments: string[] = ["index", "gnome"];

        const isTagName: boolean = underTest.isTagName(segments, 1);

        expect(isTagName).toBe(true);
    });

    it("givenTheTagsRouteSegmentItself_whenCheckingIfItIsATagName_thenItIsFalse", () => {
        const segments: string[] = ["index", "gnome"];

        const isTagName: boolean = underTest.isTagName(segments, 0);

        expect(isTagName).toBe(false);
    });

    it("givenASegmentOfAnotherRoute_whenCheckingIfItIsATagName_thenItIsFalse", () => {
        const segments: string[] = ["publications", "2"];

        const isTagName: boolean = underTest.isTagName(segments, 1);

        expect(isTagName).toBe(false);
    });
});

describe("BreadcrumbTrailResolver.address", () => {
    it("givenAStepOfTheTrail_whenAddressing_thenItIsTheWholePathDownToIt", () => {
        const segments: string[] = ["software", "all", "2"];

        expect(underTest.address(segments, 0)).toBe("/software/");
        expect(underTest.address(segments, 1)).toBe("/software/all/");
    });
});
