import type { GlassDepthName } from "./GlassDepthName";

export class GlassDepth {
    private readonly name: GlassDepthName;
    private readonly utility: string;
    private readonly blur: string;
    private readonly role: string;

    public constructor(name: GlassDepthName, utility: string, blur: string, role: string) {
        this.name = name;
        this.utility = utility;
        this.blur = blur;
        this.role = role;
    }

    public getName(): GlassDepthName {
        return this.name;
    }

    public getUtility(): string {
        return this.utility;
    }

    public getBlur(): string {
        return this.blur;
    }

    public getRole(): string {
        return this.role;
    }

    public hasBlur(): boolean {
        return this.blur !== "none";
    }
}
