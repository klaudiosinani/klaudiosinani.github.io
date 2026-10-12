import { AuthorPortrait } from "./AuthorPortrait";
import { GITHUB_USERNAME } from "./GitHubUsername";

export const AUTHOR_PORTRAIT: AuthorPortrait = new AuthorPortrait(
    GITHUB_USERNAME,
    "portrait",
    {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
    },
    480
);
