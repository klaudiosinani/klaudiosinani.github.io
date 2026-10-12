import type { NpmPackageDtoAssembler } from "./NpmPackageDtoAssembler";
import type { PackageRegistryId } from "./PackageRegistryId";
import type { PackageRegistryProbe } from "./PackageRegistryProbe";
import type { PublisherIdentity } from "./PublisherIdentity";

export class NpmPackageRegistryProbe implements PackageRegistryProbe {
    private readonly HOST: string = "https://registry.npmjs.org";

    private readonly npmPackageDtoAssembler: NpmPackageDtoAssembler;
    private readonly publisherIdentity: PublisherIdentity;

    public constructor(npmPackageDtoAssembler: NpmPackageDtoAssembler, publisherIdentity: PublisherIdentity) {
        this.npmPackageDtoAssembler = npmPackageDtoAssembler;
        this.publisherIdentity = publisherIdentity;
    }

    public getId(): PackageRegistryId {
        return "npm";
    }

    public getLabel(): string {
        return "npm";
    }

    public getHost(): string {
        return this.HOST;
    }

    public assembleProbeEndpoint(name: string): string {
        return name;
    }

    public assemblePage(name: string): string {
        return `https://www.npmjs.com/package/${name}`;
    }

    public resolveVersion(payload: unknown): string | null {
        return this.npmPackageDtoAssembler.assemble(payload).getLatestVersion();
    }

    public owns(payload: unknown): boolean {
        return this.npmPackageDtoAssembler
            .assemble(payload)
            .getMaintainerNames()
            .some((name: string) => this.publisherIdentity.is(name, this.publisherIdentity.NPM));
    }
}
