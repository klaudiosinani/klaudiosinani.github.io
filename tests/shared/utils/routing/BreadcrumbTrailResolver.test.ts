import { describe, expect, it } from "vitest";
import { BreadcrumbTrailResolver } from "@utils/routing/BreadcrumbTrailResolver";

const underTest = BreadcrumbTrailResolver;

describe("BreadcrumbTrailResolver.resolve", () => {
  it("givenANestedPathname_whenBuildingTheTrail_thenOneCrumbPerSegmentIsProduced", () => {
    // given
    const pathname = "/index/gnome";

    // when
    const segments = underTest.resolve(pathname);

    // then
    expect(segments).toEqual(["index", "gnome"]);
  });

  it("givenATrailingSlash_whenBuildingTheTrail_thenNoEmptyCrumbIsAppended", () => {
    // given
    const pathname = "/publications/";

    // when
    const segments = underTest.resolve(pathname);

    // then
    expect(segments).toEqual(["publications"]);
  });

  it("givenRepeatedTrailingSlashes_whenBuildingTheTrail_thenTheyCollapse", () => {
    // given
    const pathname = "/publications///";

    // when
    const segments = underTest.resolve(pathname);

    // then
    expect(segments).toEqual(["publications"]);
  });

  it("givenTheSiteRoot_whenBuildingTheTrail_thenNoCrumbsAreProduced", () => {
    // given
    const pathname = "/";

    // when
    const segments = underTest.resolve(pathname);

    // then
    expect(segments).toEqual([]);
  });

  it("givenAPaginatedPathname_whenBuildingTheTrail_thenThePageNumberIsItsOwnCrumb", () => {
    // given
    const pathname = "/publications/2/";

    // when
    const segments = underTest.resolve(pathname);

    // then
    expect(segments).toEqual(["publications", "2"]);
  });
});

describe("BreadcrumbTrailResolver.isTagName", () => {
  it("givenASegmentUnderTheTagsRoute_whenCheckingIfItIsATagName_thenItIsTrue", () => {
    // given
    const segments = ["index", "gnome"];

    // when
    const isTagName = underTest.isTagName(segments, 1);

    // then
    expect(isTagName).toBe(true);
  });

  it("givenTheTagsRouteSegmentItself_whenCheckingIfItIsATagName_thenItIsFalse", () => {
    // given
    const segments = ["index", "gnome"];

    // when
    const isTagName = underTest.isTagName(segments, 0);

    // then
    expect(isTagName).toBe(false);
  });

  it("givenASegmentOfAnotherRoute_whenCheckingIfItIsATagName_thenItIsFalse", () => {
    // given
    const segments = ["publications", "2"];

    // when
    const isTagName = underTest.isTagName(segments, 1);

    // then
    expect(isTagName).toBe(false);
  });
});
