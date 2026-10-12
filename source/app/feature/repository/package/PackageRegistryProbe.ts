import type { PackageRegistryId } from "./PackageRegistryId";

export interface PackageRegistryProbe {
    getId(): PackageRegistryId;
    getLabel(): string;
    getHost(): string;
    assembleProbeEndpoint(name: string): string;
    assemblePage(name: string): string;
    resolveVersion(payload: unknown): string | null;
    owns(payload: unknown): boolean;
}
