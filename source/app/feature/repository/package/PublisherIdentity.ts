export class PublisherIdentity {
    public readonly NPM: readonly string[] = ["klaudiosinani", "mariosinani"];

    public readonly SNAPCRAFT: readonly string[] = ["klaudiosinani"];

    public readonly GITHUB: readonly string[] = ["klaudiosinani", "klaussinani", "klauscfhq"];

    public ownsRepository(url: string): boolean {
        const lowered: string = url.toLowerCase();

        return this.GITHUB.some((owner: string) => lowered.includes(`github.com/${owner}/`));
    }

    public is(handle: string | undefined, known: readonly string[]): boolean {
        return handle !== undefined && known.includes(handle.toLowerCase());
    }
}
