import type { HttpApiService } from "@app/infrastructure/http/HttpApiService";
import type { NpmPackageRegistryProbe } from "./NpmPackageRegistryProbe";
import type { OptionalReader } from "@app/infrastructure/common/OptionalReader";
import type { OptionalReaderFactory } from "@app/infrastructure/common/OptionalReaderFactory";
import { PackageListing } from "./PackageListing";
import type { PackageListingSource } from "./PackageListingSource";
import type { PackageRegistryProbe } from "./PackageRegistryProbe";
import type { PypiPackageRegistryProbe } from "./PypiPackageRegistryProbe";
import type { SnapcraftPackageRegistryProbe } from "./SnapcraftPackageRegistryProbe";

export class PackageListingProvider implements PackageListingSource {
    private readonly HEADERS: Record<string, string> = { "Snap-Device-Series": "16" };

    private readonly httpApiService: HttpApiService;
    private readonly optionalReader: OptionalReader;
    private readonly packageRegistryProbes: readonly PackageRegistryProbe[];

    public constructor(
        httpApiService: HttpApiService,
        optionalReaderFactory: OptionalReaderFactory,
        npmPackageRegistryProbe: NpmPackageRegistryProbe,
        pypiPackageRegistryProbe: PypiPackageRegistryProbe,
        snapcraftPackageRegistryProbe: SnapcraftPackageRegistryProbe
    ) {
        this.httpApiService = httpApiService;
        this.optionalReader = optionalReaderFactory.create("Registries");
        this.packageRegistryProbes = [npmPackageRegistryProbe, pypiPackageRegistryProbe, snapcraftPackageRegistryProbe];
    }

    public async listings(name: string): Promise<PackageListing[]> {
        const found: (PackageListing | null)[] = await Promise.all(
            this.packageRegistryProbes.map((packageRegistryProbe: PackageRegistryProbe) =>
                this.listing(packageRegistryProbe, name)
            )
        );

        return found.filter((listing: PackageListing | null): listing is PackageListing => listing !== null);
    }

    private async listing(packageRegistryProbe: PackageRegistryProbe, name: string): Promise<PackageListing | null> {
        const payload: unknown = await this.probe(packageRegistryProbe, name);

        if (!payload || !packageRegistryProbe.owns(payload)) {
            return null;
        }

        return new PackageListing(
            packageRegistryProbe.getId(),
            packageRegistryProbe.getLabel(),
            packageRegistryProbe.assemblePage(name),
            packageRegistryProbe.resolveVersion(payload)
        );
    }

    private async probe(packageRegistryProbe: PackageRegistryProbe, name: string): Promise<unknown | null> {
        const endpoint: string = packageRegistryProbe.assembleProbeEndpoint(name);

        return this.optionalReader.read<unknown>(`${name} on ${packageRegistryProbe.getLabel()}`, () =>
            this.httpApiService.get<unknown>(packageRegistryProbe.getHost(), endpoint, {}, this.HEADERS)
        );
    }
}
