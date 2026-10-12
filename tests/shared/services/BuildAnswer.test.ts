import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { BuildAnswer } from "@app/infrastructure/BuildAnswer";

const underTest = (): BuildAnswer<string> => new BuildAnswer<string>();

describe("BuildAnswer.of", () => {
    it("givenSeveralCallers_whenAsked_thenTheAnswerIsGatheredOnce", async () => {
        const answer: BuildAnswer<string> = underTest();
        const gather: Mock<() => Promise<string>> = vi.fn(() => Promise.resolve("held"));

        const answers: string[] = await Promise.all([answer.of(gather), answer.of(gather), answer.of(gather)]);

        expect(answers).toEqual(["held", "held", "held"]);
        expect(gather).toHaveBeenCalledTimes(1);
    });

    it("givenTheGatherFails_whenAskedAgain_thenItIsGatheredAgain", async () => {
        const answer: BuildAnswer<string> = underTest();
        const gather: Mock<() => Promise<string>> = vi
            .fn<() => Promise<string>>()
            .mockRejectedValueOnce(new Error("no answer"))
            .mockResolvedValueOnce("held");

        await expect(answer.of(gather)).rejects.toThrow("no answer");

        expect(await answer.of(gather)).toBe("held");
        expect(gather).toHaveBeenCalledTimes(2);
    });

    it("givenTheAnswerIsHeld_whenAskedLater_thenTheGatherIsNotRunAgain", async () => {
        const answer: BuildAnswer<string> = underTest();
        const gather: Mock<() => Promise<string>> = vi.fn(() => Promise.resolve("held"));

        await answer.of(gather);
        await answer.of(gather);

        expect(gather).toHaveBeenCalledTimes(1);
    });
});
