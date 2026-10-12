import { Sponsor } from "./Sponsor";

export const SPONSORS: readonly Sponsor[] = [
    new Sponsor(
        "Better Stack",
        "https://github.com/BetterStackHQ",
        "/sponsors/betterstackhq.png",
        "https://betterstack.com/",
        true,
        true
    ),
    new Sponsor("GitHub", "https://github.com/github", "/sponsors/github.png", "https://github.com/", false, true),
];
