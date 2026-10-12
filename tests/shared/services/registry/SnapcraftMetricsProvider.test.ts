import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SnapcraftMetricsProvider } from "@app/infrastructure/registry/snapcraft/service/SnapcraftMetricsProvider";

const directories: string[] = [];

const artifact = (contents: string): string => {
    const directory: string = mkdtempSync(join(tmpdir(), "snap-metrics-"));
    const path: string = join(directory, "snap-metrics.json");

    directories.push(directory);
    writeFileSync(path, contents);

    return path;
};

afterEach(() => {
    directories.splice(0).forEach((directory: string) => {
        rmSync(directory, { recursive: true, force: true });
    });
});

describe("SnapcraftMetricsProvider.installedBase", () => {
    it("givenTheWorkflowArtifact_whenReadingInstalledBase_thenEverySnapIsSummed", async () => {
        const underTest: SnapcraftMetricsProvider = new SnapcraftMetricsProvider(
            artifact(JSON.stringify({ snaps: { taskbook: 8000, tusk: 4408 } }))
        );

        const installedBase: number | null = await underTest.installedBase();

        expect(installedBase).toBe(12_408);
    });

    it("givenNoArtifact_whenReadingInstalledBase_thenItIsUnavailableRatherThanZero", async () => {
        const underTest: SnapcraftMetricsProvider = new SnapcraftMetricsProvider("/nowhere/snap-metrics.json");

        const installedBase: number | null = await underTest.installedBase();

        expect(installedBase).toBeNull();
    });

    it("givenAnEmptyArtifact_whenReadingInstalledBase_thenItIsUnavailable", async () => {
        const underTest: SnapcraftMetricsProvider = new SnapcraftMetricsProvider(
            artifact(JSON.stringify({ snaps: {} }))
        );

        const installedBase: number | null = await underTest.installedBase();

        expect(installedBase).toBeNull();
    });

    it("givenAnArtifactWithoutASnapsKey_whenReadingInstalledBase_thenItIsUnavailable", async () => {
        const underTest: SnapcraftMetricsProvider = new SnapcraftMetricsProvider(
            artifact(JSON.stringify({ unexpected: true }))
        );

        const installedBase: number | null = await underTest.installedBase();

        expect(installedBase).toBeNull();
    });

    it("givenAMalformedArtifact_whenReadingInstalledBase_thenItIsUnavailable", async () => {
        const underTest: SnapcraftMetricsProvider = new SnapcraftMetricsProvider(artifact('{"snaps":'));

        const installedBase: number | null = await underTest.installedBase();

        expect(installedBase).toBeNull();
    });

    it("givenNoExplicitPath_whenConstructed_thenTheWorkflowArtifactNameIsUsed", async () => {
        const underTest: SnapcraftMetricsProvider = new SnapcraftMetricsProvider();

        expect(await underTest.installedBase()).toBeNull();
    });
});

describe("SnapcraftMetricsProvider.forSnap", () => {
    it("givenTheFileNamesTheSnap_whenAsked_thenItsOwnInstalledBaseIsGiven", async () => {
        const underTest: SnapcraftMetricsProvider = new SnapcraftMetricsProvider(
            artifact(JSON.stringify({ snaps: { taskbook: 3400, signale: 120 } }))
        );

        await expect(underTest.forSnap("taskbook")).resolves.toBe(3400);
    });

    it("givenTheFileDoesNotNameIt_whenAsked_thenNothingIsGiven", async () => {
        const underTest: SnapcraftMetricsProvider = new SnapcraftMetricsProvider(
            artifact(JSON.stringify({ snaps: { taskbook: 3400 } }))
        );

        await expect(underTest.forSnap("signale")).resolves.toBeNull();
    });
});
