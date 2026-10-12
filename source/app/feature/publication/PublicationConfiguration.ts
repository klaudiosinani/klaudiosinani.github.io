export class PublicationConfiguration {
    private readonly PUBLICATIONS_PER_INDEX: number = 4;
    private readonly SCHEDULED_MARGIN_IN_MILLISECONDS: number = 15 * 60 * 1000;

    public getPublicationsPerIndex(): number {
        return this.PUBLICATIONS_PER_INDEX;
    }

    public getScheduledMarginInMilliseconds(): number {
        return this.SCHEDULED_MARGIN_IN_MILLISECONDS;
    }
}
