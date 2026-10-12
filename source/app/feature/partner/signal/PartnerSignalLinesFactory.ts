import type { PartnerConfiguration } from "../PartnerConfiguration";
import type { PartnerProposal } from "../PartnerProposal";
import type { Reach } from "@app/feature/reach/Reach";
import type { ReachPhraser } from "@app/feature/reach/ReachPhraser";
import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";
import { SignalLine } from "@app/util/signal/SignalLine";

export class PartnerSignalLinesFactory {
    private readonly reachPhraser: ReachPhraser;
    private readonly partnerConfiguration: PartnerConfiguration;

    public constructor(reachPhraser: ReachPhraser, partnerConfiguration: PartnerConfiguration) {
        this.reachPhraser = reachPhraser;
        this.partnerConfiguration = partnerConfiguration;
    }

    public create(partnerProposal: PartnerProposal): SignalLine[] {
        const reach: Reach = partnerProposal.getReach();
        const lines: SignalLine[] = [
            ...partnerProposal
                .getReadmeProfiles()
                .map((repositoryProfile: RepositoryProfile) => this.readme(repositoryProfile)),
            new SignalLine("fav", `on ${this.partnerConfiguration.getProfileAddress()}`, true),
            new SignalLine("success", this.reachPhraser.lastMonth(reach), false),
        ];
        const dependents: string | null = this.reachPhraser.dependents(reach);
        const views: string | null = this.reachPhraser.views(reach);

        if (dependents !== null) {
            lines.push(new SignalLine("complete", dependents, false));
        }

        if (views !== null) {
            lines.push(new SignalLine("info", views, false));
        }

        return lines;
    }

    private readme(repositoryProfile: RepositoryProfile): SignalLine {
        return new SignalLine("fav", `on the readme of ${repositoryProfile.slug}`, true);
    }
}
