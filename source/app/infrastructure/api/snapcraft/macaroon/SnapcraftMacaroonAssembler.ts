import type { SnapcraftMacaroon } from "./SnapcraftMacaroon.ts";

export class SnapcraftMacaroonAssembler {
    private readonly ENCODING: BufferEncoding = "base64url";
    private readonly TERMINATOR: string = "\n";

    public assemble(snapcraftMacaroon: SnapcraftMacaroon, signature: Buffer): string {
        const terminator: Buffer = Buffer.from(this.TERMINATOR, "ascii");
        const packets: Buffer = Buffer.concat([snapcraftMacaroon.getBody(), signature, terminator]);

        return packets.toString(this.ENCODING);
    }
}
