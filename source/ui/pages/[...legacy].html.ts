import { REPOSITORY_CONFIGURATION as REPOSITORY_CONFIGURATION_KEY } from "@bindings";
import type { APIContext, APIRoute } from "astro";
import { SITE } from "@app/configuration/site/Site";

import type { LegacyDocumentAddress } from "@app/feature/repository/document/LegacyDocumentAddress";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";

import { CONTEXT } from "@app/ApplicationContext.ts";
import { LegacyDocumentAddressFactory } from "@app/feature/repository/document/LegacyDocumentAddressFactory.ts";
import { LegacyRedirectPage } from "@app/feature/repository/document/LegacyRedirectPage.ts";
import { RepositoryConfiguration } from "@app/feature/repository/profile/RepositoryConfiguration.ts";
import { GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE as GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE_KEY } from "@bindings";
import { REPOSITORY_PROFILE_RETRIEVAL_SERVICE as REPOSITORY_PROFILE_RETRIEVAL_SERVICE_KEY } from "@bindings";

const LEGACY_DOCUMENT_ADDRESS_FACTORY: LegacyDocumentAddressFactory = CONTEXT.resolve(LegacyDocumentAddressFactory);
const LEGACY_REDIRECT_PAGE: LegacyRedirectPage = CONTEXT.resolve(LegacyRedirectPage);
const REPOSITORY_CONFIGURATION: RepositoryConfiguration = CONTEXT.resolve(REPOSITORY_CONFIGURATION_KEY);
const GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE = CONTEXT.resolve(GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE_KEY);
const REPOSITORY_PROFILE_RETRIEVAL_SERVICE = CONTEXT.resolve(REPOSITORY_PROFILE_RETRIEVAL_SERVICE_KEY);

export async function getStaticPaths(): Promise<{ params: { legacy: string }; props: { to: string } }[]> {
    const repositories: GithubRepositoryData[] = await GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE.retrieve();

    const found: LegacyDocumentAddress[][] = await Promise.all(
        repositories
            .filter((githubRepositoryData: GithubRepositoryData) =>
                REPOSITORY_CONFIGURATION.profiles(githubRepositoryData.getName())
            )
            .map(async (githubRepositoryData: GithubRepositoryData) => {
                const profile: RepositoryProfile | null = await REPOSITORY_PROFILE_RETRIEVAL_SERVICE.retrieve(
                    githubRepositoryData.getName()
                );

                return profile
                    ? LEGACY_DOCUMENT_ADDRESS_FACTORY.create(githubRepositoryData.getName(), profile.documents)
                    : [];
            })
    );

    return found.flat().map((legacyDocumentAddress: LegacyDocumentAddress) => ({
        params: { legacy: legacyDocumentAddress.getFrom() },
        props: { to: legacyDocumentAddress.getTo() },
    }));
}

export const GET: APIRoute = (context: APIContext): Response => {
    const { to }: { to: string } = context.props as { to: string };

    return new Response(LEGACY_REDIRECT_PAGE.html(to, new URL(to, SITE.getWebsite()).href), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
};
