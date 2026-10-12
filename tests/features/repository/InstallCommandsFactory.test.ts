import { describe, expect, it } from "vitest";
import type { InstallCommand } from "@app/feature/repository/InstallCommand";
import { InstallCommandsFactory } from "@app/feature/repository/factory/InstallCommandsFactory";
import type { PackageListing } from "@app/feature/repository/PackageListing";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";

const underTest: typeof InstallCommandsFactory = InstallCommandsFactory;

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

const PYPI: PackageListing = {
    registry: "pypi",
    label: "PyPI",
    url: "https://pypi.org/project/qoa/",
    version: "1.0.0",
};

const profile = (packages: PackageListing[], install: string | null = null): RepositoryProfile =>
    ({
        packages,
        manual: install ? { install, html: "", headings: [] } : null,
    }) as unknown as RepositoryProfile;

const commands = (held: InstallCommand[]): string[] => held.map(({ command }: InstallCommand) => command);

describe("InstallCommandsFactory.create", () => {
    it("givenAPackageOnNpm_whenWriting_thenEachManagerStatesItsOwnCommand", () => {
        expect(commands(underTest.create(profile([NPM])))).toEqual([
            "npm install signale",
            "pnpm add signale",
            "yarn add signale",
            "bun add signale",
        ]);
    });

    it("givenAToolThatTheReadmeInstallsGlobally_whenWriting_thenEachCommandIsGlobal", () => {
        expect(commands(underTest.create(profile([NPM], "npm install --global signale")))).toEqual([
            "npm install --global signale",
            "pnpm add --global signale",
            "yarn global add signale",
            "bun add --global signale",
        ]);
    });

    it("givenTheShortFormOfTheGlobalFlag_whenWriting_thenItIsReadAsGlobal", () => {
        expect(commands(underTest.create(profile([NPM], "npm i -g signale")))[0]).toBe("npm install --global signale");
    });

    it("givenAPackageOnPyPI_whenWriting_thenPipStatesTheCommand", () => {
        expect(commands(underTest.create(profile([PYPI])))).toEqual(["pip install qoa"]);
    });

    it("givenASnap_whenWriting_thenSnapStatesTheCommand", () => {
        expect(commands(underTest.create(profile([SNAP])))).toEqual(["snap install taskbook"]);
    });

    it("givenSeveralRegistries_whenWriting_thenEachOneIsStated", () => {
        expect(underTest.create(profile([NPM, SNAP])).map(({ manager }: InstallCommand) => manager)).toEqual([
            "npm",
            "pnpm",
            "yarn",
            "bun",
            "snap",
        ]);
    });

    it("givenARegistryThatStatesNoName_whenWriting_thenNoCommandIsClaimed", () => {
        expect(underTest.create(profile([{ ...NPM, url: "https://www.npmjs.com/" }]))).toEqual([]);
    });

    it("givenARegistryThatNoCommandInstallsFrom_whenWriting_thenNoneIsClaimed", () => {
        expect(
            underTest.create(
                profile([
                    {
                        ...NPM,
                        registry: "homebrew" as PackageListing["registry"],
                        url: "https://formulae.brew.sh/formula/taskbook",
                    },
                ])
            )
        ).toEqual([]);
    });

    it("givenNoRegistry_whenWriting_thenNoCommandIsClaimed", () => {
        expect(underTest.create(profile([]))).toEqual([]);
    });
});
