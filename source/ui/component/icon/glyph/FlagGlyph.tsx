import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export function FlagGlyph({ className, ariaHidden }: IconProps): JSX.Element {
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
            <path d="M4 3a1 1 0 0 1 2 0v18a1 1 0 0 1-2 0Z" />
            <path d="M7 4c2.6-1.6 5-1.6 7 0s4.4 1.6 7 0v10c-2.6 1.6-5 1.6-7 0s-4.4-1.6-7 0Z" />
        </svg>
    );
}
