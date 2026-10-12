import type { PackageListing } from "./PackageListing";

export interface PackageListingSource {
    listings(name: string): Promise<PackageListing[]>;
}
