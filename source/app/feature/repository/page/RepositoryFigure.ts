import type { IconComponent } from "@ui/icon/IconComponent";

export class RepositoryFigure {
    private readonly icon: IconComponent;
    private readonly value: number | null;
    private readonly label: string;
    private readonly title: string | undefined;

    public constructor(icon: IconComponent, value: number | null, label: string, title: string | undefined) {
        this.icon = icon;
        this.value = value;
        this.label = label;
        this.title = title;
    }

    public getIcon(): IconComponent {
        return this.icon;
    }
    public getValue(): number | null {
        return this.value;
    }
    public getLabel(): string {
        return this.label;
    }
    public getTitle(): string | undefined {
        return this.title;
    }
}
