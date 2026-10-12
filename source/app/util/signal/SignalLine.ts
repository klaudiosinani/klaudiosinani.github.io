import type { SignalType } from "./SignalType";

export class SignalLine {
    private readonly type: SignalType;
    private readonly message: string;
    private readonly brandMention: boolean;

    public constructor(type: SignalType, message: string, brandMention: boolean) {
        this.type = type;
        this.message = message;
        this.brandMention = brandMention;
    }

    public getType(): SignalType {
        return this.type;
    }

    public getMessage(): string {
        return this.message;
    }

    public mentionsBrand(): boolean {
        return this.brandMention;
    }
}
