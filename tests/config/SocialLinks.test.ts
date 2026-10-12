import { describe, expect, it } from "vitest";
import { SOCIAL_LINKS } from "@app/configuration/SocialLinks";
import { SocialIconRegistry } from "@app/infrastructure/assets/service/SocialIconRegistry";
import type { SocialLink } from "@app/configuration/SocialLink";

const underTest: readonly SocialLink[] = SOCIAL_LINKS;

describe("SOCIAL_LINKS", () => {
    it("givenEveryConfiguredLink_whenResolvingItsIcon_thenMarkupIsReturned", () => {
        const icons: string[] = underTest.map(({ name }: SocialLink) => SocialIconRegistry.resolve(name));

        for (const icon of icons) {
            expect(icon).toContain("<svg");
        }
    });

    it("givenEveryConfiguredLink_whenInspectingIt_thenItHasAHrefAndATitle", () => {
        for (const link of underTest) {
            expect(link.href).not.toBe("");
            expect(link.linkTitle).not.toBe("");
        }
    });
});
