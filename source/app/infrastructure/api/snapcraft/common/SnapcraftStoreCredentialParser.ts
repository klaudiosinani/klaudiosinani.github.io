import type { SnapcraftStoreCredentialDto } from "./SnapcraftStoreCredentialDto.ts";
import type { SnapcraftStoreCredentialDtoAssembler } from "./SnapcraftStoreCredentialDtoAssembler.ts";
import type { SnapcraftUbuntuOneMacaroonsDto } from "./SnapcraftUbuntuOneMacaroonsDto.ts";

export class SnapcraftStoreCredentialParser {
    private readonly ENCODING: BufferEncoding = "base64";
    private readonly TOKEN_TYPE: string = "u1-macaroon";

    private readonly snapcraftStoreCredentialDtoAssembler: SnapcraftStoreCredentialDtoAssembler;

    public constructor(snapcraftStoreCredentialDtoAssembler: SnapcraftStoreCredentialDtoAssembler) {
        this.snapcraftStoreCredentialDtoAssembler = snapcraftStoreCredentialDtoAssembler;
    }

    public parse(exportedCredential: string): SnapcraftUbuntuOneMacaroonsDto {
        const decoded: string = Buffer.from(exportedCredential.trim(), this.ENCODING).toString("utf8");
        const snapcraftStoreCredentialDto: SnapcraftStoreCredentialDto =
            this.snapcraftStoreCredentialDtoAssembler.assemble(JSON.parse(decoded));

        if (snapcraftStoreCredentialDto.getTokenType() !== this.TOKEN_TYPE) {
            throw new Error(
                `The exported credential states the type ${snapcraftStoreCredentialDto.getTokenType()}. ` +
                    `The dashboard reads ${this.TOKEN_TYPE} alone, which snapcraft export-login writes by default.`
            );
        }

        return snapcraftStoreCredentialDto.getMacaroons();
    }
}
