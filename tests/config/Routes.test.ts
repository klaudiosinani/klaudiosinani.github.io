import { describe, expect, it } from "vitest";
import type { NavKey } from "@app/configuration/NavKey";
import { NAVIGATION_ITEMS } from "@app/configuration/NavigationItems";
import { PRIMARY_NAVIGATION_ITEMS } from "@app/configuration/PrimaryNavigationItems";
import { ROUTES } from "@app/configuration/Routes";
import { SECONDARY_NAVIGATION_ITEMS } from "@app/configuration/SecondaryNavigationItems";
import type { NavigationItem } from "@app/configuration/NavigationItem";

const declared: Set<string> = new Set(Object.values(ROUTES).map((route: string) => `${route}/`.replace("//", "/")));

describe("NAVIGATION_ITEMS", () => {
    it("givenEveryNavigationItem_whenReadingItsHref_thenItIsADeclaredRoute", () => {
        for (const item of NAVIGATION_ITEMS) {
            expect(declared).toContain(item.href);
        }
    });

    it("givenTheTwoGroups_whenJoined_thenTheBarComesBeforeTheMoreMenu", () => {
        expect([...NAVIGATION_ITEMS]).toEqual([...PRIMARY_NAVIGATION_ITEMS, ...SECONDARY_NAVIGATION_ITEMS]);
    });

    it("givenEveryNavigationItem_whenReadingItsKey_thenNoKeyIsUsedTwice", () => {
        const keys: NavKey[] = NAVIGATION_ITEMS.map(({ key }: NavigationItem) => key);

        expect(new Set(keys).size).toBe(keys.length);
    });
});
