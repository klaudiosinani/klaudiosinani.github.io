export class PublisherMark {
    private readonly name: string;
    private readonly mark: string;

    public constructor(name: string, mark: string) {
        this.name = name;
        this.mark = mark;
    }

    public getName(): string {
        return this.name;
    }
    public getMark(): string {
        return this.mark;
    }
}
