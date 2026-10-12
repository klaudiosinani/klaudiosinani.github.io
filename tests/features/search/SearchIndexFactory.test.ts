import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import { blogEntry } from "../../support/BlogEntry";
import type { FeaturedPress } from "@app/feature/press/FeaturedPress";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import { SearchIndexFactory } from "@app/feature/search/factory/SearchIndexFactory";
import type { SearchItem } from "@app/feature/search/SearchItem";

const underTest: typeof SearchIndexFactory = SearchIndexFactory;

const ARTICLE: CollectionEntry<"blog"> = blogEntry({
    id: "streams",
    title: "Java Stream API",
});

const REPOSITORY: RepositoryData = {
    name: "taskbook",
    description: "Tasks, boards and notes for the command line",
    url: "https://github.com/klaudiosinani/taskbook",
    stars: 9337,
    forks: 395,
    language: "JavaScript",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestUpdate: "2026-01-01T00:00:00Z",
    latestPush: "2026-01-01T00:00:00Z",
};

const FEATURE: FeaturedPress = {
    publicationTitle: "Taskbook is a Board-based Task Manager",
    summary: "An introduction for Ubuntu users.",
    issueNumber: "08/2018",
    publisherName: "OMG Ubuntu",
    publicationUrl: "https://www.omgubuntu.co.uk/2018/08/taskbook",
    softwareTitle: "Taskbook",
    softwareRepositoryUrl: "https://github.com/klaudiosinani/taskbook",
    hidden: false,
    order: 1,
};

describe("SearchIndexFactory.create", () => {
    it("givenEverythingTheSitePublishes_whenIndexing_thenEveryKindIsHeld", () => {
        const items: SearchItem[] = underTest.create([ARTICLE], [REPOSITORY], [FEATURE]);

        expect(items.map(({ kind }: SearchItem) => kind)).toEqual(["software", "publication", "press"]);
    });

    it("givenAnArticle_whenIndexing_thenItLeadsToItsPageAndStatesItsDate", () => {
        const [article] = underTest.create([ARTICLE], [], []);

        expect(article.href).toBe("/publications/streams/");
        expect(article.title).toBe("Java Stream API");
        expect(article.meta).toEqual(["Jan 1, 2026"]);
    });

    it("givenARepository_whenIndexing_thenItLeadsToItsPageAndStatesItsFacts", () => {
        const [project] = underTest.create([], [REPOSITORY], []);

        expect(project.href).toBe("/taskbook/");
        expect(project.title).toBe("Taskbook");
        expect(project.meta).toEqual(["9,337 stars"]);
    });

    it("givenARepository_whenIndexing_thenTheLanguageIsDrawnAndNotWritten", () => {
        expect(underTest.create([], [REPOSITORY], [])[0].language).toBe("JavaScript");
    });

    it("givenARepositoryInNoLanguage_whenIndexing_thenNoChipIsClaimed", () => {
        expect(underTest.create([], [{ ...REPOSITORY, language: null }], [])[0].language).toBeNull();
    });

    it("givenARepository_whenIndexing_thenItsLanguageAndSubjectsCanBeSearched", () => {
        expect(underTest.create([], [{ ...REPOSITORY, topics: ["cli", "productivity"] }], [])[0].keywords).toEqual([
            "JavaScript",
            "cli",
            "productivity",
        ]);
    });

    it("givenAnArticle_whenIndexing_thenItsSubjectsCanBeSearched", () => {
        expect(underTest.create([ARTICLE], [], [])[0].keywords).toEqual(["others"]);
    });

    it("givenAFeature_whenIndexing_thenThePublisherAndTheProjectCanBeSearched", () => {
        expect(underTest.create([], [], [FEATURE])[0].keywords).toEqual(["OMG Ubuntu", "Taskbook"]);
    });

    it("givenAFeature_whenIndexing_thenItLeadsToThePublisherAndNamesThem", () => {
        const [feature] = underTest.create([], [], [FEATURE]);

        expect(feature.href).toBe(FEATURE.publicationUrl);
        expect(feature.meta).toEqual(["OMG Ubuntu", "2018"]);
    });

    it("givenAFeatureStatingNoYear_whenIndexing_thenOnlyThePublisherIsNamed", () => {
        expect(underTest.create([], [], [{ ...FEATURE, issueNumber: "Spring" }])[0].meta).toEqual(["OMG Ubuntu"]);
    });
});
