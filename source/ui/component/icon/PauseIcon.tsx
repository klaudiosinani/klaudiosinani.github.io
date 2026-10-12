import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export function PauseIcon({ className, ariaHidden }: IconProps): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className={className}
            aria-hidden={ariaHidden}
        >
            <path d="M4.25 2.5h1.5a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-9.5a.75.75 0 0 1 .75-.75Zm6 0h1.5a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-9.5a.75.75 0 0 1 .75-.75Z"></path>
        </svg>
    );
}
