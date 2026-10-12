/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly GITHUB_TOKEN?: string;
    readonly GITHUB_TRAFFIC_TOKEN?: string;
    readonly GITHUB_CONTRIBUTIONS_TOKEN?: string;
    readonly HTTP_CACHE?: string;
    readonly SNAPCRAFT_STORE_CREDENTIALS?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
