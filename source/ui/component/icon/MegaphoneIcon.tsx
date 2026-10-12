import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export default function MegaphoneIcon({ className, ariaHidden }: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={className} aria-hidden={ariaHidden}>
            <path d="M12.5.75a.75.75 0 0 1 .75.75v13a.75.75 0 0 1-1.5 0V1.5a.75.75 0 0 1 .75-.75ZM9.5 3.14a.75.75 0 0 1 .75.75v8.22a.75.75 0 0 1-1.5 0V3.89a.75.75 0 0 1 .75-.75ZM2.5 5.5h4.25a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75H5.19l.98 3.28a.75.75 0 0 1-1.44.43L3.6 10.5H2.5A1.75 1.75 0 0 1 .75 8.75v-1.5C.75 6.284 1.534 5.5 2.5 5.5Zm-.25 1.75v1.5c0 .138.112.25.25.25H6v-2H2.5a.25.25 0 0 0-.25.25Z"></path>
        </svg>
    );
}
