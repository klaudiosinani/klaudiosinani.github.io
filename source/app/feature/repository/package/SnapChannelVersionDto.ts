export class SnapChannelVersionDto {
    private readonly channelName: string;
    private readonly version: string;

    public constructor(channelName: string, version: string) {
        this.channelName = channelName;
        this.version = version;
    }

    public getChannelName(): string {
        return this.channelName;
    }

    public getVersion(): string {
        return this.version;
    }
}
