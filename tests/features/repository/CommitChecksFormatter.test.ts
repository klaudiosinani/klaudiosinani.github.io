import { describe, expect, it } from "vitest";
import type { CommitChecks } from "@app/feature/repository/CommitChecks";
import { CommitChecksFormatter } from "@app/feature/repository/service/CommitChecksFormatter";

const underTest: typeof CommitChecksFormatter = CommitChecksFormatter;

const checks = (conclusion: CommitChecks["conclusion"], passed: number = 4, total: number = 4): CommitChecks => ({
    conclusion,
    passed,
    total,
});

describe("CommitChecksFormatter.verdict", () => {
    it("givenEveryConclusion_whenStated_thenItIsPlainWordsAndNotACode", () => {
        expect(underTest.verdict(checks("success"))).toBe("Checks passed");
        expect(underTest.verdict(checks("failure"))).toBe("Checks failed");
        expect(underTest.verdict(checks("running"))).toBe("Checks running");
        expect(underTest.verdict(checks("neutral"))).toBe("Checks finished");
    });
});

describe("CommitChecksFormatter.format", () => {
    it("givenChecksThatPassed_whenStated_thenTheCountFollowsTheWords", () => {
        expect(underTest.format(checks("success", 4, 4))).toBe("Checks passed 4/4");
    });

    it("givenChecksThatFailed_whenStated_thenTheCountStatesHowMany", () => {
        expect(underTest.format(checks("failure", 3, 5))).toBe("Checks failed 3/5");
    });
});
