export class BrandNameNormalizer {
    private readonly LIMIT: number = 40;
    private readonly SPACES: RegExp = /\s+/g;

    public normalize(raw: string): string | null {
        const name: string = raw.replace(this.SPACES, " ").trim().slice(0, this.LIMIT).trim();

        return name.length > 0 ? name : null;
    }
}

export const BRAND_NAME_NORMALIZER: BrandNameNormalizer = new BrandNameNormalizer();
