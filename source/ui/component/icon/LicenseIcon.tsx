import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export default function LicenseIcon({ className }: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={className} aria-hidden="true">
            <path d="M7.25 2.25a.75.75 0 0 1 1.5 0V13h2.75a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1 0-1.5h2.75V2.25Z"></path>
            <path d="M1.75 3.25h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"></path>
            <path d="M4 4.75 1.25 10.25h5.5L4 4.75Zm8 0-2.75 5.5h5.5L12 4.75Z"></path>
        </svg>
    );
}
