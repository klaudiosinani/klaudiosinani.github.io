import type { RouteName } from "./RouteName";
export const ROUTES: Readonly<Record<RouteName, string>> = {
    home: "/",
    publications: "/publications",
    tags: "/index",
    software: "/software",
    activity: "/activity",
    softwareArchive: "/software/all",
    press: "/press",
    about: "/about",
    experience: "/experience",
    thanks: "/thanks",
    search: "/search",
    partners: "/partners",
};
