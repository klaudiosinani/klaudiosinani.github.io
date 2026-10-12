import type { NavigationItem } from "./NavigationItem";
import { PRIMARY_NAVIGATION_ITEMS } from "./PrimaryNavigationItems";
import { SECONDARY_NAVIGATION_ITEMS } from "./SecondaryNavigationItems";

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [...PRIMARY_NAVIGATION_ITEMS, ...SECONDARY_NAVIGATION_ITEMS];
