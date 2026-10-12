export class LegacyRedirectPage {
    public html(path: string, canonical: string): string {
        return [
            "<!doctype html>",
            '<html lang="en">',
            "<head>",
            '<meta charset="utf-8">',
            '<meta name="viewport" content="width=device-width,initial-scale=1">',
            `<meta http-equiv="refresh" content="0; url=${path}">`,
            `<link rel="canonical" href="${canonical}">`,
            "<title>This page moved</title>",
            "</head>",
            "<body>",
            `<p>This page moved to <a href="${path}">${canonical}</a>.</p>`,
            "</body>",
            "</html>",
            "",
        ].join("\n");
    }
}
