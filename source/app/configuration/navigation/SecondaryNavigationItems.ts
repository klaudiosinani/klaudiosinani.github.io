import { ROUTES } from "../route/Routes";
import { NavigationItem } from "./NavigationItem";

export const SECONDARY_NAVIGATION_ITEMS: readonly NavigationItem[] = [
    new NavigationItem("press", "Press", `${ROUTES.press}/`),
    new NavigationItem("partners", "Partners", `${ROUTES.partners}/`),
];
