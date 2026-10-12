export class InstallCommandResolver {
    private readonly HEADING: RegExp = /^##\s+(install|installation|getting started|setup|quick start)\s*$/im;

    public resolve(body: string): string | null {
        const heading: RegExpExecArray | null = this.HEADING.exec(body);

        if (!heading) {
            return null;
        }

        const section: string = body.slice(heading.index + heading[0].length).split(/^##\s/m)[0];
        const fenced: RegExpExecArray | null = /```[a-z]*\n([\s\S]*?)```/i.exec(section);
        const command: string | undefined = fenced?.[1].trim();

        return command && command.length > 0 ? command : null;
    }
}
