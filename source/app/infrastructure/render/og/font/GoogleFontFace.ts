import type { FontOptions } from "./FontOptions.ts";

export class GoogleFontFace {
    private readonly name: string;
    private readonly family: string;
    private readonly weight: FontOptions["weight"];
    private readonly style: FontOptions["style"];

    public constructor(name: string, family: string, weight: FontOptions["weight"], style: FontOptions["style"]) {
        this.name = name;
        this.family = family;
        this.weight = weight;
        this.style = style;
    }

    public getName(): string {
        return this.name;
    }

    public getFamily(): string {
        return this.family;
    }

    public getWeight(): FontOptions["weight"] {
        return this.weight;
    }

    public getStyle(): FontOptions["style"] {
        return this.style;
    }
}
