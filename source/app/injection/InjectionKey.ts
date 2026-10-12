export class InjectionKey<T> {
    declare private readonly answers: T;
    private readonly name: string;

    public constructor(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }
}
