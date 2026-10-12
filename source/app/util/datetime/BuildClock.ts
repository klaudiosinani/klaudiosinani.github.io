export class BuildClock {
    private readonly at: Date;

    public constructor(at: Date) {
        this.at = at;
    }

    public now(): Date {
        return this.at;
    }
}
