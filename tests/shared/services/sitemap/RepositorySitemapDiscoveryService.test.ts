import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RepositorySitemapDiscoveryService } from "@services/sitemap/RepositorySitemapDiscoveryService";

const underTest = RepositorySitemapDiscoveryService;

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

const listing = (names: string[]): Response =>
  new Response(JSON.stringify(names.map(name => ({ name }))), { status: 200 });

describe("RepositorySitemapDiscoveryService.discover", () => {
  it("givenOneRepositoryPublishingASitemap_whenDiscoveringSitemaps_thenOnlyItsUrlIsCollected", async () => {
    // given
    vi.spyOn(globalThis, "fetch").mockImplementation(async input => {
      const url = String(input);

      if (url.includes("api.github.com")) {
        return listing(["with-sitemap", "without-sitemap"]);
      }
      if (url === "https://klaudiosinani.com/with-sitemap/sitemap.xml") {
        return new Response(null, { status: 200 });
      }
      return new Response(null, { status: 404 });
    });

    // when & then
    await expect(underTest.discover("user")).resolves.toEqual([
      "https://klaudiosinani.com/with-sitemap/sitemap.xml",
    ]);
  });

  it("givenARepository_whenDiscoveringSitemaps_thenItsSitemapIsProbedWithHead", async () => {
    // given
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async input =>
        String(input).includes("api.github.com")
          ? listing(["repo"])
          : new Response(null, { status: 200 })
      );

    // when
    await underTest.discover("user");

    // then
    expect(fetchSpy).toHaveBeenLastCalledWith(
      "https://klaudiosinani.com/repo/sitemap.xml",
      { method: "HEAD" }
    );
  });

  it("givenAFailingProbe_whenDiscoveringSitemaps_thenTheRepositoryIsSkipped", async () => {
    // given
    vi.spyOn(globalThis, "fetch").mockImplementation(async input => {
      if (String(input).includes("api.github.com")) {
        return listing(["unreachable"]);
      }
      throw new Error("network unreachable");
    });

    // when & then
    await expect(underTest.discover("user")).resolves.toEqual([]);
  });

  it("givenARejectedListing_whenDiscoveringSitemaps_thenAnEmptyListIsReturned", async () => {
    // given
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 403, statusText: "Forbidden" })
    );

    // when & then
    await expect(underTest.discover("user")).resolves.toEqual([]);
  });
});
