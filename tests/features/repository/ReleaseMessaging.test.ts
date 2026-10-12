import { describe, expect, it } from "vitest";
import { ReleaseMessaging } from "@app/feature/repository/service/ReleaseMessaging";

const underTest: typeof ReleaseMessaging = ReleaseMessaging;

describe("ReleaseMessaging.NO_NOTES", () => {
    it("givenAReleaseWithNoNotes_whenDrawn_thenTheSentenceStatesTheFact", () => {
        expect(underTest.NO_NOTES).toMatch(/release/i);
        expect(underTest.NO_NOTES.endsWith(".")).toBe(true);
    });
});
