import type { JSX } from "react";
import type { IconProps } from "@ui/icon/IconComponent";

export function SpeechBubbleGlyph({ className, ariaHidden }: IconProps): JSX.Element {
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
                d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9l-5 4v-4H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3.71 3.29 3.7 3.71-3.7 3.71-1.42-1.42L8.59 10 6.29 7.71ZM12 12v2h5.5v-2Z"
            />
        </svg>
    );
}
