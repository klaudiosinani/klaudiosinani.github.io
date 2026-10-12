import { InstallCommand } from "./InstallCommand";
import type { PackageListing } from "./PackageListing";
import type { RepositoryProfile } from "../profile/RepositoryProfile";

export class InstallCommandsFactory {
    private readonly SEPARATOR: string = "/";
    private readonly GLOBAL: RegExp = /(--global|\s-g\b)/;

    public create(profile: RepositoryProfile): InstallCommand[] {
        const commands: InstallCommand[] = [];
        const global: boolean = this.GLOBAL.test(profile.manual?.getInstall() ?? "");

        for (const listing of profile.packages) {
            commands.push(...this.forListing(listing, global));
        }

        return commands;
    }

    private forListing(listing: PackageListing, global: boolean): InstallCommand[] {
        const name: string = this.name(listing);

        if (!name) {
            return [];
        }

        if (listing.getRegistry() === "npm") {
            return global
                ? [
                      new InstallCommand("npm", `npm install --global ${name}`),
                      new InstallCommand("pnpm", `pnpm add --global ${name}`),
                      new InstallCommand("yarn", `yarn global add ${name}`),
                      new InstallCommand("bun", `bun add --global ${name}`),
                  ]
                : [
                      new InstallCommand("npm", `npm install ${name}`),
                      new InstallCommand("pnpm", `pnpm add ${name}`),
                      new InstallCommand("yarn", `yarn add ${name}`),
                      new InstallCommand("bun", `bun add ${name}`),
                  ];
        }

        if (listing.getRegistry() === "pypi") {
            return [new InstallCommand("pip", `pip install ${name}`)];
        }

        if (listing.getRegistry() === "snapcraft") {
            return [new InstallCommand("snap", `snap install ${name}`)];
        }

        return [];
    }

    private name(listing: PackageListing): string {
        const path: string = new URL(listing.getUrl()).pathname.replace(/\/+$/, "");
        const parts: string[] = path.split(this.SEPARATOR).filter(Boolean);

        if (parts[0] === "package") {
            return parts.slice(1).join(this.SEPARATOR);
        }

        return parts.length > 0 ? parts[parts.length - 1] : "";
    }
}
