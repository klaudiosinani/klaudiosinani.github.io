import { describe, expect, it } from "vitest";
import { StatedRelatedProjectsResolver } from "@app/feature/repository/service/StatedRelatedProjectsResolver";

const underTest: typeof StatedRelatedProjectsResolver = StatedRelatedProjectsResolver;

const REPOSITORY: string = "https://github.com/klaudiosinani/signale";

const readme = (section: string): string =>
    [
        "## Description",
        "",
        "A logger.",
        "",
        section,
        "",
        "## Team",
        "",
        "- Klaudio Sinani [(@klaudiosinani)](https://github.com/klaudiosinani)",
    ].join("\n");

describe("StatedRelatedProjectsResolver.resolve", () => {
    it("givenAReadmeThatNamesRelatedWork_whenResolving_thenTheNamesAreReadInOrder", () => {
        const markdown: string = readme(
            [
                "## Related",
                "",
                "- [qoa](https://github.com/klaudiosinani/qoa) - Minimal prompts",
                "- [taskbook](https://github.com/klaudiosinani/taskbook) - Tasks",
            ].join("\n")
        );

        expect(underTest.resolve(markdown, REPOSITORY)).toEqual(["qoa", "taskbook"]);
    });

    it("givenAHeadingWithMoreWords_whenResolving_thenTheSectionIsStillRead", () => {
        const markdown: string = readme(
            ["## Related Apps", "", "- [ao](https://github.com/klaudiosinani/ao)"].join("\n")
        );

        expect(underTest.resolve(markdown, REPOSITORY)).toEqual(["ao"]);
    });

    it("givenTheSectionEnds_whenResolving_thenNothingBelowItIsRead", () => {
        const markdown: string = readme(["## Related", "", "- [qoa](https://github.com/klaudiosinani/qoa)"].join("\n"));

        expect(underTest.resolve(markdown, REPOSITORY)).toEqual(["qoa"]);
    });

    it("givenALinkToAnotherAccount_whenResolving_thenItIsNotTakenAsOurOwnWork", () => {
        const markdown: string = readme(
            [
                "## Related",
                "",
                "- [chalk](https://github.com/chalk/chalk) - Terminal colours",
                "- [qoa](https://github.com/klaudiosinani/qoa)",
            ].join("\n")
        );

        expect(underTest.resolve(markdown, REPOSITORY)).toEqual(["qoa"]);
    });

    it("givenAnAddressWithMoreAfterTheName_whenResolving_thenOnlyTheNameIsRead", () => {
        const markdown: string = readme(
            [
                "## Related",
                "",
                "- [tusk](https://github.com/klaudiosinani/tusk/releases)",
                "- [ao](https://github.com/klaudiosinani/ao.git)",
            ].join("\n")
        );

        expect(underTest.resolve(markdown, REPOSITORY)).toEqual(["tusk", "ao"]);
    });

    it("givenTheSameProjectNamedTwice_whenResolving_thenItIsListedOnce", () => {
        const markdown: string = readme(
            [
                "## Related",
                "",
                "- [qoa](https://github.com/klaudiosinani/qoa) and",
                "  [qoa](https://github.com/klaudiosinani/QOA) again",
            ].join("\n")
        );

        expect(underTest.resolve(markdown, REPOSITORY)).toEqual(["qoa"]);
    });

    it("givenAReadmeWithNoSuchSection_whenResolving_thenNothingIsClaimed", () => {
        expect(underTest.resolve("## Install\n\nnpm i signale", REPOSITORY)).toEqual([]);
    });

    it("givenAnAddressThatIsNotARepositoryOfGitHub_whenResolving_thenNothingIsClaimed", () => {
        const markdown: string = readme(["## Related", "", "- [qoa](https://github.com/klaudiosinani/qoa)"].join("\n"));

        expect(underTest.resolve(markdown, "https://example.com/signale")).toEqual([]);
    });
});
