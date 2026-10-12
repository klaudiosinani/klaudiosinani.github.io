import type { Reach } from "../Reach";
import type { ReachPhraser } from "../ReachPhraser";
import { SignalLine } from "@app/util/signal/SignalLine";

export class ReachSignalLinesFactory {
    private readonly reachPhraser: ReachPhraser;

    public constructor(reachPhraser: ReachPhraser) {
        this.reachPhraser = reachPhraser;
    }

    public create(reach: Reach): SignalLine[] {
        const lines: SignalLine[] = [
            new SignalLine("success", this.reachPhraser.allTime(reach), false),
            new SignalLine("success", this.reachPhraser.lastMonth(reach), false),
            new SignalLine("star", this.reachPhraser.stars(reach), false),
        ];
        const dependents: string | null = this.reachPhraser.dependents(reach);

        if (dependents !== null) {
            lines.push(new SignalLine("complete", dependents, false));
        }

        return lines;
    }
}
