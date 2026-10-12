import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export function BookGlyph({ className, ariaHidden }: IconProps): JSX.Element {
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
            <path
                fillRule="evenodd"
                d="M7 2h12a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H7a1 1 0 0 0 0 2h12a1 1 0 0 1 0 2H7a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Zm.79 7.21L11 12.41l5.21-5.2-1.42-1.42L11 9.59 9.21 7.79Z"
            />
        </svg>
    );
}
