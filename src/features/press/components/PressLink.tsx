import ExternalLink from "@components/ExternalLink";

interface Props {
  readonly href: string;
  readonly text: string;
}

export default function PressLink({ href, text }: Props) {
  return (
    <ExternalLink href={href}>
      <span className="font-medium decoration-solid hover:underline">
        {text}
      </span>
    </ExternalLink>
  );
}
