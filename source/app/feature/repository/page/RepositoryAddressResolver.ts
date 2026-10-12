export class RepositoryAddressResolver {
    private readonly BLOB: string = "blob/HEAD";
    private readonly RAW: string = "https://raw.githubusercontent.com";

    private readonly ABSOLUTE: RegExp = /^(?:[a-z]+:|\/\/|#|mailto:)/i;

    public resolve(html: string, repository: string): string {
        return html.replace(
            /(<(?:a|img)\b[^>]*?\s(?:href|src)=")([^"]+)"/gi,
            (whole: string, opening: string, address: string) => {
                if (this.ABSOLUTE.test(address)) {
                    return whole;
                }

                const path: string = address.replace(/^\.?\//, "");
                const base: string = opening.includes("src=")
                    ? `${this.RAW}/${new URL(repository).pathname.slice(1)}/HEAD`
                    : `${repository}/${this.BLOB}`;

                return `${opening}${base}/${path}"`;
            }
        );
    }
}
