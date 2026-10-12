export class FrontmatterParser {
    private readonly BLOCK: RegExp = /^---\r?\n([\s\S]*?)\r?\n---/;
    private readonly FIELD: RegExp = /^([A-Za-z][\w-]*):\s*(.*)$/;
    private readonly QUOTES: RegExp = /^["']|["']$/g;

    public parse(source: string): Record<string, string> {
        const block: string = this.BLOCK.exec(source)?.[1] ?? "";
        const fields: Record<string, string> = {};

        for (const line of block.split("\n")) {
            const field: RegExpExecArray | null = this.FIELD.exec(line);

            if (field !== null) {
                fields[field[1]] = field[2].trim().replace(this.QUOTES, "");
            }
        }

        return fields;
    }
}
