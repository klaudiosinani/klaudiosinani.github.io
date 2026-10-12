export class BrandNamePainter {
    private readonly TARGET: string = "[data-brand-name]";

    public paint(name: string): void {
        document.querySelectorAll<HTMLElement>(this.TARGET).forEach((target: HTMLElement) => {
            target.textContent = name;
        });
    }
}

export const BRAND_NAME_PAINTER: BrandNamePainter = new BrandNamePainter();
