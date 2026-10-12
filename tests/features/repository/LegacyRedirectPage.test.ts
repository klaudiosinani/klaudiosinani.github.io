import { describe, expect, it } from "vitest";
import { LegacyRedirectPage as underTest } from "@app/feature/repository/LegacyRedirectPage";

describe("LegacyRedirectPage.html", () => {
    it("givenAPage_whenMakingTheAnswer_thenTheBrowserGetsAPath", () => {
        const path: string = "/taskbook/documentation/ja/";
        const canonical: string = `https://klaudiosinani.com${path}`;

        const html: string = underTest.html(path, canonical);

        expect(html).toContain(`<meta http-equiv="refresh" content="0; url=${path}">`);
        expect(html).toContain(`<a href="${path}">${canonical}</a>`);
    });

    it("givenAPage_whenMakingTheAnswer_thenTheSearchEngineGetsTheFullAddress", () => {
        const canonical: string = "https://klaudiosinani.com/taskbook/documentation/ja/";

        const html: string = underTest.html("/taskbook/documentation/ja/", canonical);

        expect(html).toContain(`<link rel="canonical" href="${canonical}">`);
    });

    it("givenAnAddress_whenMakingThePage_thenThePageIsWholeAndStatesItsLanguage", () => {
        const html: string = underTest.html("/kiu/", "https://klaudiosinani.com/kiu/");

        expect(html.startsWith("<!doctype html>")).toBe(true);
        expect(html).toContain('<html lang="en">');
        expect(html).toContain("</html>");
    });
});
