export class SnapcraftStoreCredential {
    public getValue(): string | undefined {
        return import.meta.env.SNAPCRAFT_STORE_CREDENTIALS || undefined;
    }

    public exists(): boolean {
        return this.getValue() !== undefined;
    }
}
