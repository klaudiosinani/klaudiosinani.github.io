import { describe, expect, it } from "vitest";
import type { AuthoredCommit } from "@app/infrastructure/github/domain/AuthoredCommit";
import { MockAuthoredCommitProvider } from "@app/infrastructure/github/service/MockAuthoredCommitProvider";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";

const underTest: MockAuthoredCommitProvider = new MockAuthoredCommitProvider();

const SONARQUBE: RepositoryRef = new RepositoryRef("SonarSource", "sonarqube");

describe("MockAuthoredCommitProvider.provide", () => {
    it("givenARepository_whenAsked_thenEveryCommitOpensInThatRepository", async () => {
        const commits: AuthoredCommit[] = await underTest.provide(SONARQUBE);

        for (const { sha, url } of commits) {
            expect(url).toBe(`https://github.com/SonarSource/sonarqube/commit/${sha}`);
        }
    });

    it("givenTheSubstituteCommits_whenAsked_thenTheyHoldEveryShapeTheListDraws", async () => {
        const commits: AuthoredCommit[] = await underTest.provide(SONARQUBE);

        expect(commits.length).toBeGreaterThan(1);
        expect(commits.some(({ message }: AuthoredCommit) => message.startsWith("SONAR-"))).toBe(true);
        expect(commits.some(({ message }: AuthoredCommit) => message.startsWith("[NO-JIRA]"))).toBe(true);
        expect(commits.some(({ message }: AuthoredCommit) => message.includes("`"))).toBe(true);
    });

    it("givenTheSubstituteCommits_whenAsked_thenEachOneStatesWhenItWasWritten", async () => {
        for (const { date } of await underTest.provide(SONARQUBE)) {
            expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        }
    });
});
