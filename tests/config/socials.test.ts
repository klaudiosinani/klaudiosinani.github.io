import { describe, expect, it } from "vitest";
import { SOCIALS } from "@config/socials";
import { SocialIconRegistry } from "@components/icons/SocialIconRegistry";

const underTest = SOCIALS;

describe("SOCIALS", () => {
  it("givenEveryConfiguredSocial_whenResolvingItsIcon_thenMarkupIsReturned", () => {
    // when
    const icons = underTest.map(({ name }) => SocialIconRegistry.resolve(name));

    // then
    for (const icon of icons) {
      expect(icon).toContain("<svg");
    }
  });

  it("givenEveryConfiguredSocial_whenInspectingIt_thenItHasAHrefAndATitle", () => {
    // then
    for (const social of underTest) {
      expect(social.href).not.toBe("");
      expect(social.linkTitle).not.toBe("");
    }
  });
});
