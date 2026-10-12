import type { ComponentType } from "react";

export interface IconProps {
    readonly className?: string;
    readonly ariaHidden?: boolean;
}

export type IconComponent = ComponentType<IconProps>;
