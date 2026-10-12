import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import type { PageTitleFormatter } from "@app/util/text/PageTitleFormatter";
import { RepositoryPageMetadata } from "./RepositoryPageMetadata";
import type { RepositoryProfile } from "../profile/RepositoryProfile";

import type { RepositoryLanguage } from "@app/feature/repository/profile/RepositoryLanguage";
import type { PackageListing } from "@app/feature/repository/package/PackageListing";

export class RepositoryPageMetadataFactory {
    private readonly numberFormatter: NumberFormatter;
    private readonly pageTitleFormatter: PageTitleFormatter;
    private readonly TITLE_LIMIT: number = 60;
    private readonly DESCRIPTION_LIMIT: number = 160;

    public constructor(numberFormatter: NumberFormatter, pageTitleFormatter: PageTitleFormatter) {
        this.numberFormatter = numberFormatter;
        this.pageTitleFormatter = pageTitleFormatter;
    }

    public create(profile: RepositoryProfile, siteTitle: string, author: string): RepositoryPageMetadata {
        return new RepositoryPageMetadata(this.title(profile, siteTitle), this.description(profile, author));
    }

    private title(profile: RepositoryProfile, siteTitle: string): string {
        if (profile.seoTitle) {
            return profile.seoTitle;
        }

        const described: string = `${profile.name} - ${this.trimmed(profile.logline)}`;

        return described.length <= this.TITLE_LIMIT
            ? described
            : this.pageTitleFormatter.format(profile.name, siteTitle);
    }

    private description(profile: RepositoryProfile, author: string): string {
        const [opening, ...rest] = [
            `${profile.name} by ${author}: ${this.trimmed(profile.logline)}.`,
            this.written(profile),
            this.reach(profile),
            this.served(profile),
            this.shipped(profile),
            this.terms(profile),
            this.started(profile),
        ].filter((sentence: string | null): sentence is string => typeof sentence === "string");

        return rest.reduce(
            (running: string, sentence: string) =>
                `${running} ${sentence}`.length <= this.DESCRIPTION_LIMIT ? `${running} ${sentence}` : running,
            opening
        );
    }

    private written(profile: RepositoryProfile): string | null {
        const languages: string[] = profile.languages.map(({ name }: RepositoryLanguage) => name).slice(0, 2);

        return languages.length > 0 ? `Written in ${languages.join(" and ")}.` : null;
    }

    private reach(profile: RepositoryProfile): string | null {
        const downloads: number | null = profile.downloads.getTotal();
        const counted: string[] = [
            downloads !== null && downloads > 0 && `${this.numberFormatter.display(downloads)} downloads`,
            profile.stars > 0 && `${this.numberFormatter.display(profile.stars)} stars`,
            profile.forks > 0 && `${this.numberFormatter.display(profile.forks)} forks`,
        ].filter((part: string | false): part is string => typeof part === "string");

        return counted.length > 0 ? `${counted.slice(0, 2).join(", ")}.` : null;
    }

    private served(profile: RepositoryProfile): string | null {
        const registries: string[] = profile.packages.map((packageListing: PackageListing) =>
            packageListing.getLabel()
        );

        if (registries.length === 0) {
            return null;
        }

        const named: string =
            registries.length === 1
                ? registries[0]
                : `${registries.slice(0, -1).join(", ")} and ${registries[registries.length - 1]}`;

        return `Available on ${named}.`;
    }

    private shipped(profile: RepositoryProfile): string | null {
        const [latest] = profile.releases;

        return latest ? `Latest release ${latest.getTag()}.` : null;
    }

    private terms(profile: RepositoryProfile): string | null {
        return profile.license ? `Open source under ${profile.license}.` : null;
    }

    private started(profile: RepositoryProfile): string {
        return `In development since ${new Date(profile.createdAt).getUTCFullYear()}.`;
    }

    private trimmed(logline: string): string {
        return logline.trim().replace(/\.+$/, "");
    }
}
