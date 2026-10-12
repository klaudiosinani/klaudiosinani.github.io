import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export default function ArrowRightIcon({ className, ariaHidden }: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden={ariaHidden}>
            <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z"></path>
        </svg>
    );
}
