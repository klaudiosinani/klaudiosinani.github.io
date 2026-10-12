import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import type { JSX } from "react";
import CommitIcon from "@ui/component/icon/CommitIcon";
import ForkIcon from "@ui/component/icon/ForkIcon";
import IssueIcon from "@ui/component/icon/IssueIcon";
import PullRequestIcon from "@ui/component/icon/PullRequestIcon";
import StarIcon from "@ui/component/icon/StarIcon";
import LanguageChip from "@ui/component/LanguageChip";
import TagIcon from "@ui/component/icon/TagIcon";
import ProjectGlyphTile from "./ProjectGlyphTile";
import type { FeaturedSoftwareEntry } from "@app/feature/software/featured/FeaturedSoftwareEntry";
import type { SoftwareSignals } from "@app/feature/software/signal/SoftwareSignals";

import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";
import { ViewTransitionName } from "@app/util/routing/ViewTransitionName.ts";

const NUMBER_FORMATTER: NumberFormatter = new NumberFormatter();
const ROUTE_PATH_RESOLVER: RoutePathResolver = new RoutePathResolver();
const VIEW_TRANSITION_NAME: ViewTransitionName = new ViewTransitionName(new SlugFormatter());

export interface FeaturedSoftwareCardProps {
    readonly entry: FeaturedSoftwareEntry;
    readonly secHeading: boolean;
    readonly lead: boolean;
}

export default function FeaturedSoftwareCard({ entry, secHeading, lead }: FeaturedSoftwareCardProps): JSX.Element {
    const softwareSignals: SoftwareSignals = entry.getSoftwareSignals();

    const name: string = entry.getName();
    const logline: string = entry.getLogline();
    const description: string = entry.getDescription();
    const url: string = entry.getUrl();
    const stars: number | null = entry.getStars();
    const forks: number | null = entry.getForks();
    const slug: string | null = entry.getSlug();
    const languages: readonly string[] = softwareSignals.getLanguages();
    const openIssues: number | null = softwareSignals.getOpenIssues();
    const openPullRequests: number | null = softwareSignals.getOpenPullRequests();
    const latestRelease: string | null = softwareSignals.getLatestRelease();
    const latestCommit: string | null = softwareSignals.getLatestCommit();

    const href: string = entry.hasPage() && slug ? ROUTE_PATH_RESOLVER.resolveRepository(slug) : url;

    const heading: JSX.Element = (
        <a
            href={href}
            className="card-link"
            style={slug ? { viewTransitionName: VIEW_TRANSITION_NAME.of("software", slug) } : undefined}
        >
            {name}
        </a>
    );

    return (
        <li
            className={lead ? "panel project-lead" : "panel"}
            data-name={name}
            data-stars={stars ?? 0}
            data-languages={languages.join(" ")}
        >
            <div className="panel-body">
                <div className="panel-content project-content">
                    <div>
                        <div className="flex items-start gap-text">
                            <ProjectGlyphTile project={slug ?? name} />
                            <div className="min-w-0 flex-1">
                                {secHeading ? (
                                    <h2 className="project-name">{heading}</h2>
                                ) : (
                                    <h3 className="project-name">{heading}</h3>
                                )}
                                <p className="card-summary">{logline}</p>
                            </div>
                        </div>
                        {languages.length > 0 && (
                            <div className="project-languages">
                                {languages.map((language: string) => (
                                    <LanguageChip key={language} language={language} />
                                ))}
                            </div>
                        )}
                    </div>
                    {lead && <p className="project-description">{description}</p>}
                </div>
                <div className="card-meta card-footer">
                    {stars !== null && (
                        <span title="Stars">
                            <StarIcon className="card-meta-icon" ariaHidden />
                            {NUMBER_FORMATTER.display(stars)}
                        </span>
                    )}
                    {forks !== null && (
                        <span title="Forks">
                            <ForkIcon className="card-meta-icon" ariaHidden />
                            {NUMBER_FORMATTER.display(forks)}
                        </span>
                    )}
                    {openIssues !== null && openIssues > 0 && (
                        <span title="Open issues">
                            <IssueIcon className="card-meta-icon" ariaHidden />
                            {NUMBER_FORMATTER.display(openIssues)}
                        </span>
                    )}
                    {openPullRequests !== null && openPullRequests > 0 && (
                        <span title="Open pull requests">
                            <PullRequestIcon className="card-meta-icon" ariaHidden />
                            {NUMBER_FORMATTER.display(openPullRequests)}
                        </span>
                    )}
                    {latestRelease && (
                        <span className="project-release" title="Latest release">
                            <TagIcon className="card-meta-icon" />
                            {latestRelease}
                        </span>
                    )}
                    {latestCommit && (
                        <span title="Latest commit">
                            <CommitIcon className="card-meta-icon" />
                            {latestCommit}
                        </span>
                    )}
                </div>
            </div>
        </li>
    );
}
