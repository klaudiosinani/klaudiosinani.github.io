import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export function GraphGlyph({ className, ariaHidden }: IconProps): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            fill="currentColor"
            className={className}
            aria-hidden={ariaHidden}
        >
            <path d="M6.88 6.52l6 11-1.76.96-6-11Z" />
            <path d="M18.88 7.48l-6 11-1.76-.96 6-11Z" />
            <rect x="6" y="6" width="12" height="2" />
            <circle cx="6" cy="7" r="3.5" />
            <circle cx="18" cy="7" r="3.5" />
            <circle cx="12" cy="18" r="3.5" />
        </svg>
    );
}
