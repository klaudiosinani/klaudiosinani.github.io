import type { PackageRegistryId } from "./PackageRegistryId";
import type { PackageRegistryProbe } from "./PackageRegistryProbe";
import type { PublisherIdentity } from "./PublisherIdentity";
import type { PypiPackageDto } from "./PypiPackageDto";
import type { PypiPackageDtoAssembler } from "./PypiPackageDtoAssembler";

export class PypiPackageRegistryProbe implements PackageRegistryProbe {
    private readonly HOST: string = "https://pypi.org/pypi";

    private readonly pypiPackageDtoAssembler: PypiPackageDtoAssembler;
    private readonly publisherIdentity: PublisherIdentity;

    public constructor(pypiPackageDtoAssembler: PypiPackageDtoAssembler, publisherIdentity: PublisherIdentity) {
        this.pypiPackageDtoAssembler = pypiPackageDtoAssembler;
        this.publisherIdentity = publisherIdentity;
    }

    public getId(): PackageRegistryId {
        return "pypi";
    }

    public getLabel(): string {
        return "PyPI";
    }

    public getHost(): string {
        return this.HOST;
    }

    public assembleProbeEndpoint(name: string): string {
        return `${name}/json`;
    }

    public assemblePage(name: string): string {
        return `https://pypi.org/project/${name}/`;
    }

    public resolveVersion(payload: unknown): string | null {
        return this.pypiPackageDtoAssembler.assemble(payload).getVersion();
    }

    public owns(payload: unknown): boolean {
        const pypiPackageDto: PypiPackageDto = this.pypiPackageDtoAssembler.assemble(payload);

        return pypiPackageDto.getProjectUrls().some((url: string) => this.publisherIdentity.ownsRepository(url));
    }
}
