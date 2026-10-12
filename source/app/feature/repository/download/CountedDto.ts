export class CountedDto {
    private readonly totalCount: number;

    public constructor(totalCount: number) {
        this.totalCount = totalCount;
    }

    public getTotalCount(): number {
        return this.totalCount;
    }
}
