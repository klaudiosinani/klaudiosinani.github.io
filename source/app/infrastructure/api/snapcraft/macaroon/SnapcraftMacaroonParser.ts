import { SnapcraftMacaroon } from "./SnapcraftMacaroon.ts";

export class SnapcraftMacaroonParser {
    private readonly ENCODING: BufferEncoding = "base64url";
    private readonly SIGNATURE_PACKET: string = "002fsignature ";
    private readonly SIGNATURE_LENGTH: number = 32;
    private readonly TERMINATOR_LENGTH: number = 1;

    public parse(serializedMacaroon: string): SnapcraftMacaroon {
        const packets: Buffer = Buffer.from(serializedMacaroon.trim(), this.ENCODING);
        const signatureStart: number = packets.length - this.SIGNATURE_LENGTH - this.TERMINATOR_LENGTH;
        const packetStart: number = signatureStart - this.SIGNATURE_PACKET.length;

        if (packetStart < 0 || packets.toString("ascii", packetStart, signatureStart) !== this.SIGNATURE_PACKET) {
            throw new Error("The macaroon states no signature that this build can read");
        }

        return new SnapcraftMacaroon(
            packets.subarray(0, signatureStart),
            packets.subarray(signatureStart, signatureStart + this.SIGNATURE_LENGTH)
        );
    }
}
