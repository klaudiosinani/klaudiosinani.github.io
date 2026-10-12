import type { ActivityKind } from "./ActivityKind";

export class ActivityEntry {
    private readonly kind: ActivityKind;
    private readonly title: string;
    private readonly reference: string;
    private readonly context: string;
    private readonly url: string;
    private readonly occurredAt: string;

    public constructor(
        kind: ActivityKind,
        title: string,
        reference: string,
        context: string,
        url: string,
        occurredAt: string
    ) {
        this.kind = kind;
        this.title = title;
        this.reference = reference;
        this.context = context;
        this.url = url;
        this.occurredAt = occurredAt;
    }

    public getKind(): ActivityKind {
        return this.kind;
    }
    public getTitle(): string {
        return this.title;
    }
    public getReference(): string {
        return this.reference;
    }
    public getContext(): string {
        return this.context;
    }
    public getUrl(): string {
        return this.url;
    }
    public getOccurredAt(): string {
        return this.occurredAt;
    }
}
