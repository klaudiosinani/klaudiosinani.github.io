import { describe, expect, it } from "vitest";
import { ReleaseInstallCommandResolver } from "@app/feature/repository/service/ReleaseInstallCommandResolver";
import type { PackageListing } from "@app/feature/repository/PackageListing";

const underTest: typeof ReleaseInstallCommandResolver = ReleaseInstallCommandResolver;

const NPM: PackageListing = {
    registry: "npm",
    label: "npm",
    url: "https://www.npmjs.com/package/signale",
    version: "4.2.0",
};

const SNAP: PackageListing = {
    registry: "snapcraft",
    label: "Snap",
    url: "https://snapcraft.io/taskbook",
    version: "2.7.1",
};

describe("ReleaseInstallCommandResolver.resolve", () => {
    it("givenAPackageOnNpm_whenResolving_thenTheCommandNamesTheVersion", () => {
        expect(underTest.resolve([NPM], "v4.2.0")).toBe("npm install signale@4.2.0");
    });

    it("givenATagWithNoPrefix_whenResolving_thenTheVersionIsStillTheTag", () => {
        expect(underTest.resolve([NPM], "4.2.0")).toBe("npm install signale@4.2.0");
    });

    it("givenNoPackageOnNpm_whenResolving_thenNothingIsClaimed", () => {
        expect(underTest.resolve([SNAP], "v2.7.1")).toBeNull();
    });

    it("givenATagThatNamesNoVersion_whenResolving_thenNothingIsClaimed", () => {
        expect(underTest.resolve([NPM], "v")).toBeNull();
    });
});
