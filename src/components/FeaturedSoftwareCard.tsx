import { slugifyStr } from "@utils/slugify";

export interface FeaturedSoftwareCardProps {
  name: string;
  logline: string;
  metadata?: string | null;
  description: string;
  url: string;
  secHeading?: boolean;
}

export default function FeaturedSoftwareCard({
  name,
  logline,
  description,
  url,
  metadata,
  secHeading = true,
}: FeaturedSoftwareCardProps) {
  const headerProps = {
    style: { viewTransitionName: slugifyStr(name) },
    className: "text-lg font-medium decoration-solid hover:underline",
  };

  return (
    <li className="mb-8 mt-6">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-lg font-medium text-skin-accent decoration-solid underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? (
          <h2 {...headerProps}>
            {name} - {logline}
          </h2>
        ) : (
          <h3 {...headerProps}>
            {name} - {logline}
          </h3>
        )}
      </a>
      {metadata && (
        <div className="flex">
          <span className="text-sm opacity-80">{metadata}</span>
        </div>
      )}
      <p>
        <i>{description}</i>
      </p>
    </li>
  );
}
