import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export function PlayIcon({ className, ariaHidden }: IconProps): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className={className}
            aria-hidden={ariaHidden}
        >
            <path d="M5 2.75v10.5a.75.75 0 0 0 1.14.64l8.25-5.25a.75.75 0 0 0 0-1.28L6.14 2.11A.75.75 0 0 0 5 2.75Z"></path>
        </svg>
    );
}
