import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export function ClapperboardGlyph({ className, ariaHidden }: IconProps): JSX.Element {
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
            <g transform="rotate(-12 3 9)">
                <path d="M3 5.5h4L3.5 9H3Z" />
                <path d="M9.5 5.5h4L10 9H6Z" />
                <path d="M16 5.5h4L16.5 9h-4Z" />
                <path d="M21 7v2h-2Z" />
            </g>
            <rect x="3" y="11" width="18" height="10" rx="2" />
        </svg>
    );
}
