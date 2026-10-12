import { describe, expect, it } from "vitest";
import { PageBreadcrumbsResolver } from "@app/util/seo/PageBreadcrumbsResolver";

import type { BreadcrumbStep } from "@app/util/seo/BreadcrumbListSchemaBuilder";
const underTest: typeof PageBreadcrumbsResolver = PageBreadcrumbsResolver;

const SITE: string = "https://klaudiosinani.com/";

describe("PageBreadcrumbsResolver.resolve", () => {
    it("givenTheHomePage_whenResolving_thenThereIsNoTrail", () => {
        expect(underTest.resolve("/", SITE, "Home")).toEqual([]);
    });

    it("givenAPage_whenResolving_thenTheTrailStartsAtTheHomePage", () => {
        const trail: BreadcrumbStep[] = underTest.resolve("/press/", SITE, "Home");

        expect(trail).toEqual([
            { name: "Home", url: "https://klaudiosinani.com/" },
            { name: "Press", url: "https://klaudiosinani.com/press/" },
        ]);
    });

    it("givenANestedPage_whenResolving_thenEveryStepIsReachable", () => {
        const trail: BreadcrumbStep[] = underTest.resolve("/software/all/", SITE, "Home");

        expect(trail.map(({ url }: BreadcrumbStep) => url)).toEqual([
            "https://klaudiosinani.com/",
            "https://klaudiosinani.com/software/",
            "https://klaudiosinani.com/software/all/",
        ]);
    });

    it("givenASegmentWithSeparators_whenResolving_thenItReadsAsWords", () => {
        const trail: BreadcrumbStep[] = underTest.resolve("/index/best-practice/", SITE, "Home");

        expect(trail[2].name).toBe("Best practice");
    });

    it("givenAnEncodedSegment_whenResolving_thenItIsDecoded", () => {
        const trail: BreadcrumbStep[] = underTest.resolve("/index/c%2B%2B/", SITE, "Home");

        expect(trail[2].name).toBe("C++");
    });

    it("givenAPathWithNoTrailingSlash_whenResolving_thenTheTrailIsTheSame", () => {
        expect(underTest.resolve("/press", SITE, "Home")).toEqual(underTest.resolve("/press/", SITE, "Home"));
    });
});
