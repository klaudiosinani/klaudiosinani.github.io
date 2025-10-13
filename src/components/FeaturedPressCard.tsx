import React from "react";

export interface FeaturedPressCardProps {
  readonly publicationTitle: string;
  readonly publisherName: string;
  readonly publicationUrl: string;
  readonly softwareTitle: string;
  readonly softwareRepositoryUrl: string;
}

const ExternalLink: React.FC<{
  readonly href: string;
  readonly text: string;
}> = ({ href, text }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-skin-accent decoration-solid underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
    >
      <span className="font-medium decoration-solid hover:underline">
        {text}
      </span>
    </a>
  );
};

const LabeledItem: React.FC<{
  readonly label: string;
  readonly children: React.ReactNode;
}> = ({ label, children }) => (
  <h3 className="text-base">
    <span className="opacity-80">{label}: </span>
    {children}
  </h3>
);

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
        <ExternalLink href={publicationUrl} text={publicationTitle} />
      </LabeledItem>

      <LabeledItem label="Published by">
        <ExternalLink href={publicationUrl} text={publisherName} />
      </LabeledItem>

      <LabeledItem label="Featured Software">
        <ExternalLink href={softwareRepositoryUrl} text={softwareTitle} />
      </LabeledItem>
    </li>
  );
}
