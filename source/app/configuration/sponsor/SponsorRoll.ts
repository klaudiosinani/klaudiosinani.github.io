import type { Sponsor } from "./Sponsor";
import { SPONSORS } from "./Sponsors";

export class SponsorRoll {
    public current(): Sponsor[] {
        return SPONSORS.filter((sponsor: Sponsor) => sponsor.isCurrent());
    }

    public past(): Sponsor[] {
        return SPONSORS.filter((sponsor: Sponsor) => !sponsor.isCurrent());
    }
}
