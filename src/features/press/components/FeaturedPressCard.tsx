import LabeledItem from "./LabeledItem";
import PressLink from "./PressLink";

export interface FeaturedPressCardProps {
  readonly publicationTitle: string;
  readonly publisherName: string;
  readonly publicationUrl: string;
  readonly softwareTitle: string;
  readonly softwareRepositoryUrl: string;
}

export default function FeaturedPressCard({
  publicationTitle,
  publisherName,
  publicationUrl,
  softwareTitle,
  softwareRepositoryUrl,
}: FeaturedPressCardProps) {
  return (
    <li className="mb-8 mt-6">
      <LabeledItem label="Title">
        <PressLink href={publicationUrl} text={publicationTitle} />
      </LabeledItem>

      <LabeledItem label="Published by">
        <PressLink href={publicationUrl} text={publisherName} />
      </LabeledItem>

      <LabeledItem label="Featured Software">
        <PressLink href={softwareRepositoryUrl} text={softwareTitle} />
      </LabeledItem>
    </li>
  );
}
