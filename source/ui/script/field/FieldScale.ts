export class FieldScale {
    private readonly NARROW_WIDTH: number = 640;

    public isNarrow(width: number): boolean {
        return width < this.NARROW_WIDTH;
    }
}

export const FIELD_SCALE: FieldScale = new FieldScale();
