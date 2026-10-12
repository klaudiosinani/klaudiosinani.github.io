import type { SnapChannelVersionDto } from "./SnapChannelVersionDto";

export class SnapPackageDto {
    private readonly channelVersions: readonly SnapChannelVersionDto[];
    private readonly publisherUsername: string | null;

    public constructor(channelVersions: readonly SnapChannelVersionDto[], publisherUsername: string | null) {
        this.channelVersions = channelVersions;
        this.publisherUsername = publisherUsername;
    }

    public getChannelVersions(): readonly SnapChannelVersionDto[] {
        return this.channelVersions;
    }

    public getPublisherUsername(): string | null {
        return this.publisherUsername;
    }

    public findVersionOfChannel(channelName: string): string | null {
        const found: SnapChannelVersionDto | undefined = this.channelVersions.find(
            (channelVersion: SnapChannelVersionDto) => channelVersion.getChannelName() === channelName
        );

        return found === undefined ? null : found.getVersion();
    }
}
