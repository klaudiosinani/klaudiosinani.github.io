import { describe, expect, it } from "vitest";
import { ActivityKindTally } from "@app/feature/activity/ActivityKindTally";
import type { ActivityEntry } from "@app/feature/activity/ActivityEntry";
import type { ActivityKind } from "@app/feature/activity/ActivityKind";

const underTest: typeof ActivityKindTally = ActivityKindTally;

const entry = (kind: ActivityKind): ActivityEntry => ({
    kind,
    title: "Tighten the public type surface",
    reference: "c3d4e5f",
    context: "signale",
    url: "https://github.com/klaudiosinani/signale",
    occurredAt: "2026-08-07T00:00:00Z",
});

describe("ActivityKindTally.of", () => {
    it("givenBothKinds_whenTallying_thenEachIsCountedSeparately", () => {
        const entries: ActivityEntry[] = [
            entry("release"),
            entry("commit"),
            entry("commit"),
            entry("release"),
            entry("commit"),
        ];

        const tally: Record<ActivityKind, number> = underTest.of(entries);

        expect(tally).toEqual({ release: 2, commit: 3 });
    });

    it("givenNoEntries_whenTallying_thenBothKindsAreZero", () => {
        const entries: ActivityEntry[] = [];

        const tally: Record<ActivityKind, number> = underTest.of(entries);

        expect(tally).toEqual({ release: 0, commit: 0 });
    });

    it("givenOnlyOneKind_whenTallying_thenTheOtherStaysZero", () => {
        const entries: ActivityEntry[] = [entry("release"), entry("release")];

        const tally: Record<ActivityKind, number> = underTest.of(entries);

        expect(tally).toEqual({ release: 2, commit: 0 });
    });
});
