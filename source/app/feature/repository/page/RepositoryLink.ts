import type { IconComponent } from "@ui/icon/IconComponent";

export class RepositoryLink {
    private readonly label: string;
    private readonly href: string;
    private readonly icon: IconComponent;
    private readonly color: string | null;

    public constructor(label: string, href: string, icon: IconComponent, color: string | null) {
        this.label = label;
        this.href = href;
        this.icon = icon;
        this.color = color;
    }

    public getLabel(): string {
        return this.label;
    }
    public getHref(): string {
        return this.href;
    }
    public getIcon(): IconComponent {
        return this.icon;
    }
    public getColor(): string | null {
        return this.color;
    }
}
