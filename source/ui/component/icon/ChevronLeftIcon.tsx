import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export default function ChevronLeftIcon({ className, ariaHidden }: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden={ariaHidden}>
            <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
        </svg>
    );
}
