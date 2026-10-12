export class OrdinalIndexFormatter {
    private readonly WIDTH: number = 2;
    private readonly FILL: string = "0";

    public format(position: number): string {
        return `${position + 1}`.padStart(this.WIDTH, this.FILL);
    }
}
