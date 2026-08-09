import { DatetimeFormatter } from "@utils/datetime/DatetimeFormatter";
import { TitleFormatter } from "@utils/text/TitleFormatter";

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
  return (
    <li className="mb-8 mt-6">
      <a
        href={homepageUrl}
        rel="noopener noreferrer"
        className="accent-link inline-block text-lg font-medium"
      >
        <h2 className="card-heading">{TitleFormatter.format(name)}</h2>
      </a>

      {description && <p className="text-skin-base">{description}</p>}

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-skin-base opacity-80">
        <div>{stars.toLocaleString()} stars</div>
        <div>{forks.toLocaleString()} forks</div>
        <div>Updated {DatetimeFormatter.formatDate(latestUpdate)}</div>
      </div>
    </li>
  );
}
