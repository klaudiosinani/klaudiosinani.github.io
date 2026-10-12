export class FieldPalette {
    private readonly ink: string;
    private readonly line: string;
    private readonly accent: string;
    private readonly paper: string;

    public constructor(ink: string, line: string, accent: string, paper: string) {
        this.ink = ink;
        this.line = line;
        this.accent = accent;
        this.paper = paper;
    }

    public inkAt(alpha: number): string {
        return `rgba(${this.ink}, ${alpha})`;
    }

    public lineAt(alpha: number): string {
        return `rgba(${this.line}, ${alpha})`;
    }

    public accentAt(alpha: number): string {
        return `rgba(${this.accent}, ${alpha})`;
    }

    public paperAt(alpha: number): string {
        return `rgba(${this.paper}, ${alpha})`;
    }
}
