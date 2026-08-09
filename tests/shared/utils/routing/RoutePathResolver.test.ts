import { describe, expect, it } from "vitest";
import { RoutePathResolver } from "@utils/routing/RoutePathResolver";
import { ROUTES } from "@config/routes";

const underTest = RoutePathResolver;

describe("RoutePathResolver.publication", () => {
  it("givenAPublicationSlug_whenResolvingItsPagePath_thenATrailingSlashUrlIsBuilt", () => {
    // given
    const slug = "a-post";

    // when
    const path = underTest.resolvePublication(slug);

    // then
    expect(path).toBe("/publications/a-post/");
  });

  it("givenAPublicationSlug_whenResolvingItsPagePath_thenTheRouteComesFromConfiguration", () => {
    // given
    const slug = "a-post";

    // when
    const path = underTest.resolvePublication(slug);

    // then
    expect(path).toContain(ROUTES.publications);
  });
});

describe("RoutePathResolver.tag", () => {
  it("givenATagSlug_whenResolvingItsIndexPath_thenItSitsUnderTheTagsRoute", () => {
    // given
    const tag = "linux";

    // when
    const path = underTest.resolveTag(tag);

    // then
    expect(path).toBe("/index/linux");
  });

  it("givenATagSlug_whenResolvingItsIndexPath_thenNoTrailingSlashBlocksPagination", () => {
    // given
    const tag = "linux";

    // when
    const path = underTest.resolveTag(tag);

    // then
    expect(path.endsWith("/")).toBe(false);
    expect(`${path}/2`).toBe("/index/linux/2");
  });
});

describe("RoutePathResolver.publicationImage", () => {
  it("givenAPublicationSlug_whenResolvingItsImagePath_thenItMatchesTheGeneratedEndpoint", () => {
    // given
    const slug = "a-post";

    // when
    const path = underTest.resolvePublicationImage(slug);

    // then
    expect(path).toBe("/publications/a-post.png");
  });

  it("givenAPublicationSlug_whenResolvingItsImagePath_thenThePagePathIsNotReused", () => {
    // given
    const slug = "a-post";

    // when
    const path = underTest.resolvePublicationImage(slug);

    // then
    expect(path).not.toContain("/.png");
  });
});
