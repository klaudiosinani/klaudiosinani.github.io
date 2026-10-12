export class DataSource {
    private readonly ON: string = "1";
    private readonly OFF: string = "0";

    public isCaching(): boolean {
        const stated: string | undefined = import.meta.env.HTTP_CACHE;

        if (stated === this.OFF) {
            return false;
        }

        if (stated === this.ON) {
            return true;
        }

        return !import.meta.env.PROD;
    }
}
