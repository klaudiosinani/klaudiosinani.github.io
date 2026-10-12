export class LanguageColorResolver {
    private readonly COLORS: Readonly<Record<string, string>> = {
        c: "#555555",
        "c#": "#178600",
        "c++": "#f34b7d",
        css: "#563d7c",
        dockerfile: "#384d54",
        go: "#00add8",
        html: "#e34c26",
        java: "#b07219",
        javascript: "#f1e05a",
        kotlin: "#a97bff",
        lua: "#000080",
        makefile: "#427819",
        php: "#4f5d95",
        python: "#3572a5",
        ruby: "#701516",
        rust: "#dea584",
        scss: "#c6538c",
        shell: "#89e051",
        swift: "#f05138",
        typescript: "#3178c6",
        vue: "#41b883",
    };

    public resolve(language: string): string | null {
        return this.COLORS[language.toLowerCase()] ?? null;
    }
}
