import GitHubMarkIcon from "@ui/component/icon/brands/GitHubMarkIcon";
import type { IconComponent } from "@ui/icon/IconComponent";
import NpmIcon from "@ui/component/icon/brands/NpmIcon";
import type { PackageRegistryId } from "../package/PackageRegistryId";
import PypiIcon from "@ui/component/icon/brands/PypiIcon";
import { RepositoryLink } from "./RepositoryLink";
import SnapcraftIcon from "@ui/component/icon/brands/SnapcraftIcon";
import type { RepositoryProfile } from "../profile/RepositoryProfile";

import type { PackageListing } from "@app/feature/repository/package/PackageListing";
export class RepositoryLinkFactory {
    private readonly MARKS: Readonly<Record<PackageRegistryId, IconComponent>> = {
        npm: NpmIcon,
        pypi: PypiIcon,
        snapcraft: SnapcraftIcon,
    };

    private readonly COLOURS: Readonly<Record<PackageRegistryId, string>> = {
        npm: "#CB3837",
        pypi: "#3775A9",
        snapcraft: "#82BEA6",
    };

    public create(profile: RepositoryProfile): RepositoryLink[] {
        return [
            new RepositoryLink("GitHub", profile.url, GitHubMarkIcon, null),
            ...profile.packages.map(
                (packageListing: PackageListing) =>
                    new RepositoryLink(
                        packageListing.getLabel(),
                        packageListing.getUrl(),
                        this.MARKS[packageListing.getRegistry()],
                        this.COLOURS[packageListing.getRegistry()]
                    )
            ),
        ];
    }
}
