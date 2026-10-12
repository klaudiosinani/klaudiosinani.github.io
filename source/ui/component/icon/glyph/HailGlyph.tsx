import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export function HailGlyph({ className, ariaHidden }: IconProps): JSX.Element {
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
            <circle cx="7" cy="10.5" r="3.5" />
            <circle cx="12.5" cy="8" r="5.5" />
            <circle cx="17" cy="10.5" r="3.5" />
            <rect x="7" y="10.5" width="10" height="3.5" />
            <circle cx="7.5" cy="17.75" r="1.75" />
            <circle cx="12" cy="20.25" r="1.75" />
            <circle cx="16.5" cy="17.75" r="1.75" />
        </svg>
    );
}
