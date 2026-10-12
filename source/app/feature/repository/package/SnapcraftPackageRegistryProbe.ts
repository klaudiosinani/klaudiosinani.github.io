import type { PackageRegistryId } from "./PackageRegistryId";
import type { PackageRegistryProbe } from "./PackageRegistryProbe";
import type { PublisherIdentity } from "./PublisherIdentity";
import type { SnapPackageDtoAssembler } from "./SnapPackageDtoAssembler";

export class SnapcraftPackageRegistryProbe implements PackageRegistryProbe {
    private readonly HOST: string = "https://api.snapcraft.io/v2/snaps";
    private readonly STABLE_CHANNEL: string = "stable";

    private readonly snapPackageDtoAssembler: SnapPackageDtoAssembler;
    private readonly publisherIdentity: PublisherIdentity;

    public constructor(snapPackageDtoAssembler: SnapPackageDtoAssembler, publisherIdentity: PublisherIdentity) {
        this.snapPackageDtoAssembler = snapPackageDtoAssembler;
        this.publisherIdentity = publisherIdentity;
    }

    public getId(): PackageRegistryId {
        return "snapcraft";
    }

    public getLabel(): string {
        return "Snap";
    }

    public getHost(): string {
        return this.HOST;
    }

    public assembleProbeEndpoint(name: string): string {
        return `info/${name}`;
    }

    public assemblePage(name: string): string {
        return `https://snapcraft.io/${name}`;
    }

    public resolveVersion(payload: unknown): string | null {
        return this.snapPackageDtoAssembler.assemble(payload).findVersionOfChannel(this.STABLE_CHANNEL);
    }

    public owns(payload: unknown): boolean {
        return this.publisherIdentity.is(
            this.snapPackageDtoAssembler.assemble(payload).getPublisherUsername() ?? undefined,
            this.publisherIdentity.SNAPCRAFT
        );
    }
}
