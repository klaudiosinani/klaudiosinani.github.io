import { describe, expect, it } from "vitest";
import { DependentCounts } from "@app/feature/repository/signal/DependentCounts";
import { DependentTotalCalculator } from "@app/feature/reach/DependentTotalCalculator";
import { RepositoryProfileFixture } from "./RepositoryProfileFixture";

describe("DependentTotalCalculator", () => {
    const dependentTotalCalculator: DependentTotalCalculator = new DependentTotalCalculator();
    const repositoryProfileFixture: RepositoryProfileFixture = new RepositoryProfileFixture();

    it("givenSeveralRepositories_whenTotalling_thenEveryDependentCounts", () => {
        expect(
            dependentTotalCalculator.total([
                repositoryProfileFixture.create(null, new DependentCounts(155_132, 0), []),
                repositoryProfileFixture.create(null, new DependentCounts(141, 0), []),
                repositoryProfileFixture.create(null, null, []),
            ])
        ).toBe(155_273);
    });

    it("givenNoAnswerFromAnyRepository_whenTotalling_thenThereIsNoTotal", () => {
        expect(dependentTotalCalculator.total([repositoryProfileFixture.create(null, null, [])])).toBeNull();
    });
});
