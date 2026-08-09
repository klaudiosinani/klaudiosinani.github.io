import type { ReactNode } from "react";

interface Props {
  readonly href: string;
  readonly className?: string;
  readonly children: ReactNode;
}

export default function ExternalLink({ href, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`accent-link${className ? ` ${className}` : ""}`}
    >
      {children}
    </a>
  );
}
