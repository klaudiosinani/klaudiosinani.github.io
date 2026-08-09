import ExternalLink from "@components/ExternalLink";
import { SlugFormatter } from "@utils/text/SlugFormatter";

export interface FeaturedSoftwareCardProps {
  readonly name: string;
  readonly logline: string;
  readonly metadata?: string | null;
  readonly url: string;
  readonly secHeading?: boolean;
}

export default function FeaturedSoftwareCard({
  name,
  logline,
  url,
  metadata,
  secHeading = true,
}: FeaturedSoftwareCardProps) {
  const headerProps = {
    style: { viewTransitionName: SlugFormatter.format(name) },
    className: "card-heading",
  };

  return (
    <li className="mb-8 mt-6">
      <ExternalLink href={url} className="inline-block text-lg font-medium">
        {secHeading ? (
          <h2 {...headerProps}>{name}</h2>
        ) : (
          <h3 {...headerProps}>{name}</h3>
        )}
      </ExternalLink>
      {metadata && (
        <div className="flex">
          <span className="text-sm opacity-80">{metadata}</span>
        </div>
      )}
      <p>
        <i>{logline}</i>
      </p>
    </li>
  );
}
