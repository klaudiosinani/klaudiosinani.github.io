import { LOCALE } from "@app/configuration/site/SiteLocale";

export class NumberFormatter {
    private readonly COMPACT: Intl.NumberFormat = new Intl.NumberFormat(LOCALE.getLanguageTag()[0], {
        notation: "compact",
        maximumFractionDigits: 1,
    });

    private readonly EXACT: Intl.NumberFormat = new Intl.NumberFormat(LOCALE.getLanguageTag()[0]);

    private readonly SHARE: Intl.NumberFormat = new Intl.NumberFormat(LOCALE.getLanguageTag()[0], {
        style: "percent",
        maximumFractionDigits: 1,
    });

    private readonly SMALLEST_SHARE: number = 0.001;

    private readonly COMPACT_FROM: number = 100_000;

    public display(value: number): string {
        return Math.abs(value) < this.COMPACT_FROM ? this.exact(value) : this.compact(value);
    }

    public compact(value: number): string {
        return this.COMPACT.format(value);
    }

    public exact(value: number): string {
        return this.EXACT.format(value);
    }

    public share(value: number): string {
        return value > 0 && value < this.SMALLEST_SHARE
            ? `<${this.SHARE.format(this.SMALLEST_SHARE)}`
            : this.SHARE.format(value);
    }
}
