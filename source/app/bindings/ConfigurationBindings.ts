import type { InstanceFactoryRegistry } from "@app/injection/InstanceFactoryRegistry.ts";
import { ApplicationConfiguration } from "@app/configuration/ApplicationConfiguration.ts";
import { AuthorProfiles } from "@app/configuration/author/AuthorProfiles.ts";
import { SponsorRoll } from "@app/configuration/sponsor/SponsorRoll.ts";

export const bindConfiguration = (registry: InstanceFactoryRegistry): void => {
    registry.bind(ApplicationConfiguration, () => new ApplicationConfiguration());
    registry.bind(AuthorProfiles, () => new AuthorProfiles());
    registry.bind(SponsorRoll, () => new SponsorRoll());
};
