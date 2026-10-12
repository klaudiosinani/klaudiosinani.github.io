import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export default function PackageIcon({ className, ariaHidden }: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={className} aria-hidden={ariaHidden}>
            <path d="M8.878.392a1.75 1.75 0 0 0-1.756 0l-5.25 3.045A1.75 1.75 0 0 0 1 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 0 0 1.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514ZM7.875 1.69a.25.25 0 0 1 .25 0l4.63 2.685L8 7.133 3.245 4.375Zm-5.25 9.933a.25.25 0 0 1-.125-.216V5.677l5.25 3.045v5.917Zm6.625 3.017V8.722l5.25-3.045v5.729a.25.25 0 0 1-.125.216Z"></path>
        </svg>
    );
}
