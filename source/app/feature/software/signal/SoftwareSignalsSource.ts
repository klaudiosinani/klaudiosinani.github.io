import type { SoftwareSignals } from "./SoftwareSignals";

export interface SoftwareSignalsSource {
    signals(slugs: readonly string[]): Promise<ReadonlyMap<string, SoftwareSignals>>;
}
