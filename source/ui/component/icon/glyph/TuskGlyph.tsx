import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export function TuskGlyph({ className, ariaHidden }: IconProps): JSX.Element {
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
            <path d="M7.5 12.15v7.99a17 17 0 0 0 13.5-16.64 15.65 15.65 0 0 1-13.5 8.65Z" />
            <path d="M3 11.63v8.84a17 17 0 0 0 2.5-.04v-8.35a15.65 15.65 0 0 1-2.5-.45Z" />
        </svg>
    );
}
