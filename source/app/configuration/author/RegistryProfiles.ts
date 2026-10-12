import { RegistryProfile } from "./RegistryProfile";

export const REGISTRY_PROFILES: readonly RegistryProfile[] = [
    new RegistryProfile("npm", "https://www.npmjs.com/~klaudiosinani", "Packages on npm"),
    new RegistryProfile("Snapcraft", "https://snapcraft.io/publisher/klaudiosinani", "Applications on the Snap Store"),
];
