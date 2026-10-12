import { describe, expect, it } from "vitest";
import { InstallCommandResolver } from "@app/feature/repository/service/InstallCommandResolver";

const underTest: typeof InstallCommandResolver = InstallCommandResolver;

describe("InstallCommandResolver.resolve", () => {
    it("givenAnInstallSection_whenResolving_thenItsFirstCommandIsTaken", () => {
        expect(underTest.resolve("## Install\n\n```bash\nnpm install --global taskbook\n```\n\n## Usage\n")).toBe(
            "npm install --global taskbook"
        );
    });

    it("givenTheSectionUnderAnotherName_whenResolving_thenItIsStillFound", () => {
        for (const heading of ["Installation", "Getting started", "Setup", "Quick start"]) {
            expect(underTest.resolve(`## ${heading}\n\n\`\`\`sh\nbrew install tusk\n\`\`\`\n`)).toBe(
                "brew install tusk"
            );
        }
    });

    it("givenACommandInAnotherSection_whenResolving_thenItIsNotTaken", () => {
        expect(underTest.resolve("## Usage\n\n```js\nconst a = 1;\n```\n")).toBeNull();
    });

    it("givenAnInstallSectionWithNoCommand_whenResolving_thenNothingIsClaimed", () => {
        expect(underTest.resolve("## Install\n\nRead the guide.\n")).toBeNull();
    });

    it("givenAnEmptyBlockUnderTheHeading_whenResolving_thenNothingIsClaimed", () => {
        expect(underTest.resolve("## Install\n\n```bash\n\n```\n")).toBeNull();
    });
});
