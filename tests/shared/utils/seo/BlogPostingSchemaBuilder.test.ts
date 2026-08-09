import { describe, expect, it } from "vitest";
import { BlogPostingSchemaBuilder } from "@utils/seo/BlogPostingSchemaBuilder";

const underTest = BlogPostingSchemaBuilder;

const details = {
  headline: "A Post - Klaudio Sinani",
  image: "https://klaudiosinani.com/header.jpeg",
  author: "Klaudio Sinani",
  profile: "https://klaudiosinani.com/",
  pubDatetime: new Date("2026-01-02T03:04:05Z"),
};

describe("BlogPostingSchemaBuilder.build", () => {
  it("givenAPublishedPost_whenBuildingTheSchema_thenASchemaOrgBlogPostingIsDeclared", () => {
    // when
    const schema = underTest.build(details);

    // then
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("BlogPosting");
  });

  it("givenAPublishedPost_whenBuildingTheSchema_thenTheHeadlineAndImageAreCarriedThrough", () => {
    // when
    const schema = underTest.build(details);

    // then
    expect(schema.headline).toBe(details.headline);
    expect(schema.image).toBe(details.image);
  });

  it("givenAPublishedPost_whenBuildingTheSchema_thenTheDateIsIso8601", () => {
    // when
    const schema = underTest.build(details);

    // then
    expect(schema.datePublished).toBe("2026-01-02T03:04:05.000Z");
  });

  it("givenAPostNeverModified_whenBuildingTheSchema_thenDateModifiedIsOmitted", () => {
    // given
    const neverModified = { ...details, modDatetime: null };

    // when
    const implicit = underTest.build(details);
    const explicit = underTest.build(neverModified);

    // then
    expect(implicit).not.toHaveProperty("dateModified");
    expect(explicit).not.toHaveProperty("dateModified");
  });

  it("givenAModifiedPost_whenBuildingTheSchema_thenDateModifiedIsIncluded", () => {
    // given
    const modified = {
      ...details,
      modDatetime: new Date("2026-02-03T04:05:06Z"),
    };

    // when
    const schema = underTest.build(modified);

    // then
    expect(schema.dateModified).toBe("2026-02-03T04:05:06.000Z");
  });

  it("givenAPublishedPost_whenBuildingTheSchema_thenItIsAttributedToTheAuthorProfile", () => {
    // when
    const schema = underTest.build(details);

    // then
    expect(schema.author).toEqual([
      { "@type": "Person", name: details.author, url: details.profile },
    ]);
  });

  it("givenAPageWithoutAPublicationDate_whenBuildingTheSchema_thenTheExistingOutputIsPreserved", () => {
    // given
    const undated = { ...details, pubDatetime: undefined };

    // when
    const schema = underTest.build(undated);

    // then
    expect(schema.datePublished).toBe("undefined");
  });
});
