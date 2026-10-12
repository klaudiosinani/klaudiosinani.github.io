import { describe, expect, it } from "vitest";
import { PressProjectResolver } from "@app/feature/press/service/PressProjectResolver";

const underTest: typeof PressProjectResolver = PressProjectResolver;

const REPOSITORY: string = "https://github.com/klaudiosinani/taskbook";

describe("PressProjectResolver.resolve", () => {
    it("givenARepositoryTheBuildRead_whenResolving_thenTheCardLeadsToItsPage", () => {
        expect(underTest.resolve(REPOSITORY, ["taskbook", "signale"])).toBe("/taskbook/");
    });

    it("givenANameInCapitals_whenResolving_thenThePageIsStillFound", () => {
        expect(underTest.resolve(REPOSITORY, ["Taskbook"])).toBe("/Taskbook/");
    });

    it("givenARepositoryWithNoPage_whenResolving_thenTheCardLeadsToGitHub", () => {
        expect(underTest.resolve(REPOSITORY, ["signale"])).toBe(REPOSITORY);
    });

    it("givenNoRepositoryAtAll_whenResolving_thenTheCardLeadsToGitHub", () => {
        expect(underTest.resolve(REPOSITORY, [])).toBe(REPOSITORY);
    });
});
