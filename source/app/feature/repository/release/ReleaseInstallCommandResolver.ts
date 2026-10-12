import type { PackageListing } from "../package/PackageListing";

export class ReleaseInstallCommandResolver {
    private readonly REGISTRY: string = "npm";
    private readonly PREFIX: RegExp = /^v/;
    private readonly SEPARATOR: string = "/";

    public resolve(packages: readonly PackageListing[], tag: string): string | null {
        const listing: PackageListing | undefined = packages.find(
            (packageListing: PackageListing) => packageListing.getRegistry() === this.REGISTRY
        );

        if (!listing) {
            return null;
        }

        const name: string = listing.getUrl().replace(/\/+$/, "").split(this.SEPARATOR).slice(-1)[0];
        const version: string = tag.replace(this.PREFIX, "");

        return name && version ? `npm install ${name}@${version}` : null;
    }
}
