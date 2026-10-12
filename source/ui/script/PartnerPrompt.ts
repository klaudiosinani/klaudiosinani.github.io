import { BRAND_NAME_ADDRESS, type BrandNameAddress } from "./BrandNameAddress";
import { BRAND_NAME_NORMALIZER, type BrandNameNormalizer } from "./BrandNameNormalizer";
import { BRAND_NAME_PAINTER, type BrandNamePainter } from "./BrandNamePainter";

export class PartnerPrompt {
    private readonly FIELD: string = "[data-brand-input]";
    private readonly brandNameNormalizer: BrandNameNormalizer;
    private readonly brandNameAddress: BrandNameAddress;
    private readonly brandNamePainter: BrandNamePainter;

    public constructor(
        brandNameNormalizer: BrandNameNormalizer,
        brandNameAddress: BrandNameAddress,
        brandNamePainter: BrandNamePainter
    ) {
        this.brandNameNormalizer = brandNameNormalizer;
        this.brandNameAddress = brandNameAddress;
        this.brandNamePainter = brandNamePainter;
    }

    public mount(): void {
        const field: HTMLInputElement | null = document.querySelector<HTMLInputElement>(this.FIELD);

        if (!field) {
            return;
        }

        const given: string | null = this.brandNameNormalizer.normalize(this.brandNameAddress.read() ?? "");

        if (given !== null) {
            field.value = given;
            this.brandNamePainter.paint(given);
        }

        field.addEventListener("input", () => this.answer(field));
    }

    private answer(field: HTMLInputElement): void {
        const name: string | null = this.brandNameNormalizer.normalize(field.value);

        this.brandNamePainter.paint(name ?? field.placeholder);
        this.brandNameAddress.write(name);
    }
}

export const PARTNER_PROMPT: PartnerPrompt = new PartnerPrompt(
    BRAND_NAME_NORMALIZER,
    BRAND_NAME_ADDRESS,
    BRAND_NAME_PAINTER
);
