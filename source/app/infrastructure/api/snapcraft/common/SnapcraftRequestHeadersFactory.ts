import type { SnapcraftMacaroonBinder } from "../macaroon/SnapcraftMacaroonBinder.ts";
import type { SnapcraftStoreCredential } from "./SnapcraftStoreCredential.ts";
import type { SnapcraftStoreCredentialParser } from "./SnapcraftStoreCredentialParser.ts";
import type { SnapcraftUbuntuOneMacaroonsDto } from "./SnapcraftUbuntuOneMacaroonsDto.ts";

export class SnapcraftRequestHeadersFactory {
    private readonly CONTENT_TYPE: string = "application/json";

    private readonly snapcraftStoreCredential: SnapcraftStoreCredential;
    private readonly snapcraftStoreCredentialParser: SnapcraftStoreCredentialParser;
    private readonly snapcraftMacaroonBinder: SnapcraftMacaroonBinder;

    public constructor(
        snapcraftStoreCredential: SnapcraftStoreCredential,
        snapcraftStoreCredentialParser: SnapcraftStoreCredentialParser,
        snapcraftMacaroonBinder: SnapcraftMacaroonBinder
    ) {
        this.snapcraftStoreCredential = snapcraftStoreCredential;
        this.snapcraftStoreCredentialParser = snapcraftStoreCredentialParser;
        this.snapcraftMacaroonBinder = snapcraftMacaroonBinder;
    }

    public create(extraHeaders: Record<string, string>): Record<string, string> {
        const exportedCredential: string | undefined = this.snapcraftStoreCredential.getValue();

        if (exportedCredential === undefined) {
            return { "Content-Type": this.CONTENT_TYPE, ...extraHeaders };
        }

        const snapcraftUbuntuOneMacaroonsDto: SnapcraftUbuntuOneMacaroonsDto =
            this.snapcraftStoreCredentialParser.parse(exportedCredential);
        const boundDischargeMacaroon: string = this.snapcraftMacaroonBinder.bind(
            snapcraftUbuntuOneMacaroonsDto.getRoot(),
            snapcraftUbuntuOneMacaroonsDto.getDischarge()
        );

        return {
            "Content-Type": this.CONTENT_TYPE,
            Authorization: `Macaroon root=${snapcraftUbuntuOneMacaroonsDto.getRoot()}, discharge=${boundDischargeMacaroon}`,
            ...extraHeaders,
        };
    }
}
