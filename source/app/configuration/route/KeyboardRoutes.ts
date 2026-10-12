import { KeyboardRoute } from "./KeyboardRoute";
import { ROUTES } from "@app/configuration/route/Routes";

export const KEYBOARD_ROUTES: readonly KeyboardRoute[] = [
    new KeyboardRoute("h", "Home", "/"),
    new KeyboardRoute("a", "Activity", `${ROUTES.activity}/`),
    new KeyboardRoute("s", "Software", `${ROUTES.software}/`),
    new KeyboardRoute("p", "Publications", `${ROUTES.publications}/`),
    new KeyboardRoute("r", "Press", `${ROUTES.press}/`),
    new KeyboardRoute("b", "About", `${ROUTES.about}/`),
    new KeyboardRoute("t", "Thanks", `${ROUTES.thanks}/`),
];
