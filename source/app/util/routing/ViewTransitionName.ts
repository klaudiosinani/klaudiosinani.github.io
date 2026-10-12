import type { SlugFormatter } from "@app/util/text/SlugFormatter";

export class ViewTransitionName {
    private readonly slugFormatter: SlugFormatter;

    public constructor(slugFormatter: SlugFormatter) {
        this.slugFormatter = slugFormatter;
    }
    public of(kind: string, value: string): string {
        return `${kind}-${this.slugFormatter.format(value)}`;
    }
}
