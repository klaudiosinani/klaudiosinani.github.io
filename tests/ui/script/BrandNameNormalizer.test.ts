import { describe, expect, it } from "vitest";
import { BrandNameNormalizer } from "@ui/script/BrandNameNormalizer";

describe("BrandNameNormalizer", () => {
    const brandNameNormalizer: BrandNameNormalizer = new BrandNameNormalizer();

    it("keeps a plain name as it is", () => {
        expect(brandNameNormalizer.normalize("MongoDB")).toBe("MongoDB");
    });

    it("trims the ends and joins the spaces inside", () => {
        expect(brandNameNormalizer.normalize("  Better   Stack \n")).toBe("Better Stack");
    });

    it("answers no name for an empty field", () => {
        expect(brandNameNormalizer.normalize("   ")).toBeNull();
    });

    it("cuts a name at forty characters", () => {
        expect(brandNameNormalizer.normalize("A".repeat(60))).toHaveLength(40);
    });

    it("leaves no space at the end of a cut name", () => {
        expect(brandNameNormalizer.normalize(`${"A".repeat(39)} B`)).toBe("A".repeat(39));
    });
});
