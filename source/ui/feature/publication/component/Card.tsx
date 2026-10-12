import type { JSX } from "react";
import ClockIcon from "@ui/component/icon/ClockIcon";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

import { KeywordNameFormatter } from "@app/util/text/KeywordNameFormatter.ts";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";
import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import { ViewTransitionName } from "@app/util/routing/ViewTransitionName.ts";

const KEYWORD_NAME_FORMATTER: KeywordNameFormatter = new KeywordNameFormatter();
const ROUTE_PATH_RESOLVER: RoutePathResolver = new RoutePathResolver();
const SLUG_FORMATTER: SlugFormatter = new SlugFormatter();
const VIEW_TRANSITION_NAME: ViewTransitionName = new ViewTransitionName(new SlugFormatter());

export interface Props {
    readonly href?: string;
    readonly frontmatter: CollectionEntry<"blog">["data"];
    readonly secHeading?: boolean;
    readonly minutes?: number;
    readonly lead?: boolean;
}

const SHOWN_KEYWORDS: number = 3;

export default function Card({ href, frontmatter, secHeading = true, minutes, lead = false }: Props): JSX.Element {
    const { title, pubDatetime, modDatetime, description, tags } = frontmatter;

    const subjects: string[] = (tags ?? []).slice(0, SHOWN_KEYWORDS);

    const heading: JSX.Element = (
        <a
            href={href}
            className="card-link"
            style={{
                viewTransitionName: VIEW_TRANSITION_NAME.of("publication", title),
            }}
        >
            {title}
        </a>
    );

    return (
        <li className={lead ? "panel publication-lead" : "panel"}>
            <div className="panel-body">
                <div className="panel-content">
                    {secHeading ? <h2 className="card-title">{heading}</h2> : <h3 className="card-title">{heading}</h3>}
                    <p className="card-summary">{description}</p>
                    {subjects.length > 0 && (
                        <ul className="card-keywords">
                            {subjects.map((tag: string) => (
                                <li key={tag}>
                                    <a
                                        href={`${ROUTE_PATH_RESOLVER.resolveTag(SLUG_FORMATTER.format(tag))}/`}
                                        className="chip card-keyword"
                                    >
                                        {KEYWORD_NAME_FORMATTER.format(SLUG_FORMATTER.format(tag))}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="card-meta card-footer">
                    <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} size="xs" />
                    {minutes !== undefined && (
                        <span>
                            <ClockIcon className="card-meta-icon" ariaHidden />
                            {minutes} min read
                        </span>
                    )}
                </div>
            </div>
        </li>
    );
}
