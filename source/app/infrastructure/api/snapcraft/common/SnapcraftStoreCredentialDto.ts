import type { SnapcraftUbuntuOneMacaroonsDto } from "./SnapcraftUbuntuOneMacaroonsDto.ts";

export class SnapcraftStoreCredentialDto {
    private readonly tokenType: string;
    private readonly macaroons: SnapcraftUbuntuOneMacaroonsDto;

    public constructor(tokenType: string, macaroons: SnapcraftUbuntuOneMacaroonsDto) {
        this.tokenType = tokenType;
        this.macaroons = macaroons;
    }

    public getTokenType(): string {
        return this.tokenType;
    }

    public getMacaroons(): SnapcraftUbuntuOneMacaroonsDto {
        return this.macaroons;
    }
}
