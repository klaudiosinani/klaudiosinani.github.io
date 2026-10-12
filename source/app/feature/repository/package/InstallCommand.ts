export class InstallCommand {
    private readonly manager: string;
    private readonly command: string;

    public constructor(manager: string, command: string) {
        this.manager = manager;
        this.command = command;
    }

    public getManager(): string {
        return this.manager;
    }
    public getCommand(): string {
        return this.command;
    }
}
