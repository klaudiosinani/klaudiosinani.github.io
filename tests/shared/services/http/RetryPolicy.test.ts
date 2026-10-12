import { describe, expect, it } from "vitest";
import { RetryPolicy } from "@app/infrastructure/http/domain/RetryPolicy";

const underTest: typeof RetryPolicy = RetryPolicy;

const answer = (status: number, headers: Record<string, string> = {}): Response =>
    new Response("", { status, headers });

describe("RetryPolicy.delay", () => {
    it("givenAServiceThatIsBusy_whenAsked_thenItIsWorthSendingAgain", () => {
        expect(underTest.delay(answer(429), 1)).toBe(500);
        expect(underTest.delay(answer(503), 1)).toBe(500);
    });

    it("givenRepeatedFailures_whenAsked_thenEachWaitIsLongerThanTheLast", () => {
        expect(underTest.delay(answer(502), 1)).toBe(500);
        expect(underTest.delay(answer(502), 2)).toBe(1_000);
    });

    it("givenTheLastAttempt_whenAsked_thenTheAnswerStands", () => {
        expect(underTest.delay(answer(502), 3)).toBeNull();
    });

    it("givenAWaitThatTheServiceStated_whenAsked_thenThatWaitIsKept", () => {
        expect(underTest.delay(answer(429, { "retry-after": "2" }), 1)).toBe(2_000);
    });

    it("givenAWaitLongerThanTheBuildCanHold_whenAsked_thenItIsCapped", () => {
        expect(underTest.delay(answer(429, { "retry-after": "600" }), 1)).toBe(8_000);
    });

    it("givenAWaitThatIsNotANumber_whenAsked_thenThePolicyDecidesInstead", () => {
        expect(underTest.delay(answer(429, { "retry-after": "Wed, 21 Oct 2026" }), 1)).toBe(500);
    });

    it("givenARefusalForABurst_whenAsked_thenItIsWorthSendingAgain", () => {
        expect(underTest.delay(answer(403, { "retry-after": "1" }), 1)).toBe(1_000);
        expect(underTest.delay(answer(403, { "x-ratelimit-remaining": "0" }), 1)).toBe(500);
    });

    it("givenARefusalForAMissingPermission_whenAsked_thenItIsFinal", () => {
        expect(underTest.delay(answer(403), 1)).toBeNull();
        expect(underTest.delay(answer(403, { "x-ratelimit-remaining": "4999" }), 1)).toBeNull();
    });

    it("givenAnAnswerOfNoSuchThing_whenAsked_thenItIsFinal", () => {
        expect(underTest.delay(answer(404), 1)).toBeNull();
        expect(underTest.delay(answer(200), 1)).toBeNull();
    });
});

describe("RetryPolicy.afterError", () => {
    it("givenARequestThatNeverArrived_whenAsked_thenItIsWorthSendingAgain", () => {
        expect(underTest.afterError(1)).toBe(500);
        expect(underTest.afterError(2)).toBe(1_000);
    });

    it("givenTheLastAttempt_whenAsked_thenTheBuildGoesOnWithoutIt", () => {
        expect(underTest.afterError(3)).toBeNull();
    });
});
