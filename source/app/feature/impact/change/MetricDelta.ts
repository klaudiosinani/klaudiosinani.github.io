export class MetricDelta {
    private readonly text: string;
    private readonly direction: "up" | "down";
    private readonly label: string;

    public constructor(text: string, direction: "up" | "down", label: string) {
        this.text = text;
        this.direction = direction;
        this.label = label;
    }

    public getText(): string {
        return this.text;
    }
    public getDirection(): "up" | "down" {
        return this.direction;
    }
    public getLabel(): string {
        return this.label;
    }
}
