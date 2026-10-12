import { createHmac } from "node:crypto";
import type { SnapcraftMacaroon } from "./SnapcraftMacaroon.ts";
import type { SnapcraftMacaroonAssembler } from "./SnapcraftMacaroonAssembler.ts";
import type { SnapcraftMacaroonParser } from "./SnapcraftMacaroonParser.ts";

export class SnapcraftMacaroonBinder {
    private readonly ALGORITHM: string = "sha256";
    private readonly KEY_LENGTH: number = 32;

    private readonly snapcraftMacaroonParser: SnapcraftMacaroonParser;
    private readonly snapcraftMacaroonAssembler: SnapcraftMacaroonAssembler;

    public constructor(
        snapcraftMacaroonParser: SnapcraftMacaroonParser,
        snapcraftMacaroonAssembler: SnapcraftMacaroonAssembler
    ) {
        this.snapcraftMacaroonParser = snapcraftMacaroonParser;
        this.snapcraftMacaroonAssembler = snapcraftMacaroonAssembler;
    }

    public bind(serializedRootMacaroon: string, serializedDischargeMacaroon: string): string {
        const rootMacaroon: SnapcraftMacaroon = this.snapcraftMacaroonParser.parse(serializedRootMacaroon);
        const dischargeMacaroon: SnapcraftMacaroon = this.snapcraftMacaroonParser.parse(serializedDischargeMacaroon);

        const key: Buffer = Buffer.alloc(this.KEY_LENGTH);
        const rootDigest: Buffer = this.digest(key, rootMacaroon.getSignature());
        const dischargeDigest: Buffer = this.digest(key, dischargeMacaroon.getSignature());
        const digests: Buffer = Buffer.concat([rootDigest, dischargeDigest]);
        const signature: Buffer = this.digest(key, digests);

        return this.snapcraftMacaroonAssembler.assemble(dischargeMacaroon, signature);
    }

    private digest(key: Buffer, message: Buffer): Buffer {
        return createHmac(this.ALGORITHM, key).update(message).digest();
    }
}
