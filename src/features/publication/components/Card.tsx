import { SlugFormatter } from "@utils/text/SlugFormatter";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  readonly href?: string;
  readonly frontmatter: CollectionEntry<"blog">["data"];
  readonly secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: SlugFormatter.format(title) },
    className: "card-heading",
  };

  return (
    <li className="my-6">
      <a href={href} className="accent-link inline-block text-lg font-medium">
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
      <p>
        <i>{description}</i>
      </p>
    </li>
  );
}
