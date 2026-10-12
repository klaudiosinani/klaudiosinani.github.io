import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export default function ExternalIcon({ className, ariaHidden }: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={className} aria-hidden={ariaHidden}>
            <path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v8.5C2 13.216 2.784 14 3.75 14h8.5A1.75 1.75 0 0 0 14 12.25v-3.5a.75.75 0 0 0-1.5 0v3.5a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-8.5a.25.25 0 0 1 .25-.25h3.5a.75.75 0 0 0 0-1.5Z"></path>
            <path d="M9.5 2.75A.75.75 0 0 1 10.25 2h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0V4.56L8.28 8.78a.75.75 0 0 1-1.06-1.06l4.22-4.22h-1.19a.75.75 0 0 1-.75-.75Z"></path>
        </svg>
    );
}
