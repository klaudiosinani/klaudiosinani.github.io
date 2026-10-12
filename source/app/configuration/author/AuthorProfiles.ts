import type { RegistryProfile } from "./RegistryProfile";
import { REGISTRY_PROFILES } from "./RegistryProfiles";
import type { SocialLink } from "@app/configuration/social/SocialLink";
import { SOCIAL_LINKS } from "../social/SocialLinks";

export class AuthorProfiles {
    public readonly ALL: readonly string[] = this.gather();

    private gather(): readonly string[] {
        return [...new Set([...this.social(), ...this.registries()])];
    }

    private social(): string[] {
        return SOCIAL_LINKS.filter((socialLink: SocialLink) => socialLink.isOnTheWeb()).map((socialLink: SocialLink) =>
            socialLink.getHref()
        );
    }

    private registries(): string[] {
        return REGISTRY_PROFILES.map((registryProfile: RegistryProfile) => registryProfile.getHref());
    }
}
