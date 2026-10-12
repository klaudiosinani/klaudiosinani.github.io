import { SnapcraftStoreCredentialDto } from "./SnapcraftStoreCredentialDto.ts";
import { SnapcraftUbuntuOneMacaroonsDto } from "./SnapcraftUbuntuOneMacaroonsDto.ts";

export class SnapcraftStoreCredentialDtoAssembler {
    public assemble(payload: unknown): SnapcraftStoreCredentialDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const macaroons: Record<string, unknown> = (record.v ?? {}) as Record<string, unknown>;

        if (typeof macaroons.r !== "string" || typeof macaroons.d !== "string") {
            throw new Error("The exported credential holds no macaroon pair");
        }

        return new SnapcraftStoreCredentialDto(
            typeof record.t === "string" ? record.t : "",
            new SnapcraftUbuntuOneMacaroonsDto(macaroons.r, macaroons.d)
        );
    }
}
