import { LandingSection } from "./LandingSection";
import { ROUTES } from "@app/configuration/route/Routes";

export const LANDING_SECTIONS: readonly LandingSection[] = [
    new LandingSection("activity", "Activity", null, null),
    new LandingSection("open-source", "Open source software", `${ROUTES.software}/`, "All software"),
    new LandingSection("publications", "Publications", `${ROUTES.publications}/`, "All publications"),
    new LandingSection("organizations", "Organizations that support my work", null, null),
    new LandingSection("featured", "Featured by", `${ROUTES.press}/`, "All press"),
];
