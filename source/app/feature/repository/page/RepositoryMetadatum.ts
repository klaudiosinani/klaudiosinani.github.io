import type { CommitCheckConclusion } from "../commit/CommitCheckConclusion";
import type { IconComponent } from "@ui/icon/IconComponent";

export class RepositoryMetadatum {
    private readonly icon: IconComponent;
    private readonly label: string;
    private readonly title: string | undefined;
    private readonly href: string | undefined;
    private readonly state: CommitCheckConclusion | undefined;

    public constructor(
        icon: IconComponent,
        label: string,
        title: string | undefined,
        href: string | undefined,
        state: CommitCheckConclusion | undefined
    ) {
        this.icon = icon;
        this.label = label;
        this.title = title;
        this.href = href;
        this.state = state;
    }

    public getIcon(): IconComponent {
        return this.icon;
    }
    public getLabel(): string {
        return this.label;
    }
    public getTitle(): string | undefined {
        return this.title;
    }
    public getHref(): string | undefined {
        return this.href;
    }
    public getState(): CommitCheckConclusion | undefined {
        return this.state;
    }
}
