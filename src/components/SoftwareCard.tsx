export interface SoftwareCardProps {
  readonly name: string;
  readonly description: string;
  readonly homepageUrl: string;
  readonly stars: number;
  readonly forks: number;
  readonly latestUpdate: string;
}

export default function SoftwareCard({
  name,
  description,
  homepageUrl,
  stars,
  forks,
  latestUpdate,
}: SoftwareCardProps) {
  const capitalizedName = name
    .split("-")
    .map(x => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");

  const headerProps = {
    className: "text-lg font-medium decoration-solid hover:underline",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <li className="mb-8 mt-6">
      <a
        href={homepageUrl}
        rel="noopener noreferrer"
        className="inline-block text-lg font-medium text-skin-accent decoration-solid underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {<h2 {...headerProps}>{capitalizedName}</h2>}
      </a>

      {description && (
        <div className="">
          <p className="text-skin-base">{description}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-skin-base opacity-80">
        <div>{stars.toLocaleString()} stars</div>
        <div>{forks.toLocaleString()} forks</div>
        <div>Updated {formatDate(latestUpdate)}</div>
      </div>
    </li>
  );
}
