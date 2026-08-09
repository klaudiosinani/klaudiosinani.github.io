import { NAV_ITEMS } from "@config/routes";

export type NavKey = (typeof NAV_ITEMS)[number]["key"] | "tags" | "search";
