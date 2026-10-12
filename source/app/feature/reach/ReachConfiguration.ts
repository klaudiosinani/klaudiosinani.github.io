export class ReachConfiguration {
    private readonly LEAD_REPOSITORY: string = "signale";
    private readonly RECORD_START_YEAR: number = 2018;

    public getLeadRepository(): string {
        return this.LEAD_REPOSITORY;
    }

    public getRecordStartYear(): number {
        return this.RECORD_START_YEAR;
    }
}
