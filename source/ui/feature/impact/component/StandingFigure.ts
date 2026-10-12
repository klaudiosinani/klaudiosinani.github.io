import type { IconComponent } from "@ui/icon/IconComponent";

export interface StandingFigure {
    icon: IconComponent;
    value: number;
    label: string;
    note?: string;
    title?: string;
}
