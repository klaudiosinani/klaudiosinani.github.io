import { ShareLink } from "./ShareLink";

export class ShareLinksFactory {
    public create(title: string, address: string): ShareLink[] {
        const text: string = encodeURIComponent(`${title} ${address}`);
        const encoded: string = encodeURIComponent(address);
        const name: string = encodeURIComponent(title);

        return [
            new ShareLink("Bluesky", `https://bsky.app/intent/compose?text=${text}`),
            new ShareLink("Mastodon", `https://mastodon.social/share?text=${text}`),
            new ShareLink("X", `https://x.com/intent/tweet?url=${encoded}&text=${name}`),
            new ShareLink("Hacker News", `https://news.ycombinator.com/submitlink?u=${encoded}&t=${name}`),
        ];
    }
}
