export class SnapcraftUbuntuOneMacaroonsDto {
    private readonly root: string;
    private readonly discharge: string;

    public constructor(root: string, discharge: string) {
        this.root = root;
        this.discharge = discharge;
    }

    public getRoot(): string {
        return this.root;
    }

    public getDischarge(): string {
        return this.discharge;
    }
}
