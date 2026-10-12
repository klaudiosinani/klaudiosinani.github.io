import { describe, expect, it } from "vitest";
import type { FeaturedPress } from "@app/feature/press/coverage/FeaturedPress";
import { Outlet } from "@app/feature/press/outlet/Outlet";
import { OutletFactory } from "@app/feature/press/outlet/OutletFactory";

function featuredPress(publisherName: string, publicationUrl: string): FeaturedPress {
    return {
        publicationTitle: "A title",
        summary: "A summary",
        issueNumber: "",
        publisherName: publisherName,
        publicationUrl: publicationUrl,
        softwareTitle: "taskbook",
        softwareRepositoryUrl: "https://github.com/klaudiosinani/taskbook",
        order: 1,
    };
}

describe("OutletFactory", () => {
    const outletFactory: OutletFactory = new OutletFactory();

    it("givenTwoArticlesOfOneOutlet_whenCreating_thenTheOutletStandsOnceWithItsFirstArticle", () => {
        const outlets: Outlet[] = outletFactory.create([
            featuredPress("OMG! Ubuntu", "https://www.omgubuntu.co.uk/first"),
            featuredPress("GitHub", "https://github.blog/article"),
            featuredPress("OMG! Ubuntu", "https://www.omgubuntu.co.uk/second"),
        ]);

        expect(outlets.map((outlet: Outlet) => outlet.getName())).toEqual(["OMG! Ubuntu", "GitHub"]);
        expect(outlets[0]?.getHref()).toBe("https://www.omgubuntu.co.uk/first");
    });

    it("givenNoArticle_whenCreating_thenNoOutletStands", () => {
        expect(outletFactory.create([])).toEqual([]);
    });
});
