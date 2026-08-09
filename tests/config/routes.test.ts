import { describe, expect, it } from "vitest";
import { NAV_ITEMS, ROUTES } from "@config/routes";

describe("NAV_ITEMS", () => {
  it("givenEveryDeclaredRoute_whenInspectingNavItems_thenEachHrefResolvesToOne", () => {
    // given
    const routes = new Set(
      Object.values(ROUTES).map(route => `${route}/`.replace("//", "/"))
    );

    // when & then
    for (const item of NAV_ITEMS) {
      expect(routes).toContain(item.href);
    }
  });
});
