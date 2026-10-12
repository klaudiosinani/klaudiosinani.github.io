import type { JSX } from "react";
import type { PublicationDates } from "@app/feature/publication/reading/PublicationDates";
import CalendarIcon from "@ui/component/icon/CalendarIcon";
import FormattedDatetime from "./FormattedDatetime";

import { DisplayDatetimeResolver } from "@app/util/datetime/DisplayDatetimeResolver.ts";

const DISPLAY_DATETIME_RESOLVER: DisplayDatetimeResolver = new DisplayDatetimeResolver();
type DatetimeSize = "xs" | "sm" | "lg";

interface Props extends PublicationDates {
    readonly size?: DatetimeSize;
    readonly className?: string;
}

const TEXT_SIZES: Readonly<Record<DatetimeSize, string>> = {
    xs: "text-xs",
    sm: "text-sm",
    lg: "text-base",
};
const ICON_SIZES: Readonly<Record<DatetimeSize, string>> = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    lg: "h-5 w-5",
};

export default function Datetime({ pubDatetime, modDatetime, size = "sm", className = "" }: Props): JSX.Element {
    const textSize: string = TEXT_SIZES[size];
    const iconSize: string = ICON_SIZES[size];

    return (
        <div className={`flex items-center gap-inline ${className}`.trim()}>
            <CalendarIcon className={`${iconSize} inline-block shrink-0 fill-skin-base opacity-70`} ariaHidden />
            {DISPLAY_DATETIME_RESOLVER.isUpdated(pubDatetime, modDatetime) ? (
                <span className={textSize}>Updated:</span>
            ) : (
                <span className="sr-only">Published:</span>
            )}
            <span className={textSize}>
                <FormattedDatetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
            </span>
        </div>
    );
}
