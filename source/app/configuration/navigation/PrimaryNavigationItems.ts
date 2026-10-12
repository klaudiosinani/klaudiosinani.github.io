import { ROUTES } from "../route/Routes";
import { NavigationItem } from "./NavigationItem";

export const PRIMARY_NAVIGATION_ITEMS: readonly NavigationItem[] = [
    new NavigationItem("software", "Software", `${ROUTES.software}/`),
    new NavigationItem("activity", "Activity", `${ROUTES.activity}/`),
    new NavigationItem("about", "About", `${ROUTES.about}/`),
    new NavigationItem("posts", "Publications", `${ROUTES.publications}/`),
    new NavigationItem("thanks", "Thanks", `${ROUTES.thanks}/`),
];
