export class SoftwareConfiguration {
    private readonly SOFTWARE_PER_INDEX: number = 4;
    private readonly SOFTWARE_PER_ARCHIVE_PAGE: number = 12;

    public getSoftwarePerIndex(): number {
        return this.SOFTWARE_PER_INDEX;
    }

    public getSoftwarePerArchivePage(): number {
        return this.SOFTWARE_PER_ARCHIVE_PAGE;
    }
}
