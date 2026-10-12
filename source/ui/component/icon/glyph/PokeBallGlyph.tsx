import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export function PokeBallGlyph({ className, ariaHidden }: IconProps): JSX.Element {
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
            <path d="M2.05 11a10 10 0 0 1 19.9 0h-5.56a4.5 4.5 0 0 0-8.78 0Z" />
            <path d="M2.05 13a10 10 0 0 0 19.9 0h-5.56a4.5 4.5 0 0 1-8.78 0Z" />
            <circle cx="12" cy="12" r="2.5" />
        </svg>
    );
}
