import type { PackageRegistryId } from "./PackageRegistryId";

export class PackageListing {
    private readonly registry: PackageRegistryId;
    private readonly label: string;
    private readonly url: string;
    private readonly version: string | null;

    public constructor(registry: PackageRegistryId, label: string, url: string, version: string | null) {
        this.registry = registry;
        this.label = label;
        this.url = url;
        this.version = version;
    }

    public getRegistry(): PackageRegistryId {
        return this.registry;
    }
    public getLabel(): string {
        return this.label;
    }
    public getUrl(): string {
        return this.url;
    }
    public getVersion(): string | null {
        return this.version;
    }
}
