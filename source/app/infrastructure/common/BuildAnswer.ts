export class BuildAnswer<T> {
    private pending?: Promise<T>;

    public async of(gather: () => Promise<T>): Promise<T> {
        this.pending ??= gather().catch((error: unknown) => {
            this.pending = undefined;

            throw error;
        });

        return this.pending;
    }
}
