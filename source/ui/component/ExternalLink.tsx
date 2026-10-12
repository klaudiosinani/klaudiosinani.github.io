import type { JSX } from "react";
import type { ReactNode } from "react";

interface Props {
    readonly href: string;
    readonly className?: string;
    readonly title?: string;
    readonly children: ReactNode;
}

export default function ExternalLink({ href, className, title, children }: Props): JSX.Element {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={title}
            className={`accent-link${className ? ` ${className}` : ""}`}
        >
            {children}
        </a>
    );
}
