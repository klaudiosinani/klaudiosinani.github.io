import { describe, expect, it } from "vitest";
import { ScenePicker } from "@ui/script/field/ScenePicker";

describe("ScenePicker", () => {
    const scenePicker: ScenePicker = new ScenePicker();

    it("givenAKnownSceneInTheAddress_whenPicking_thenThatSceneWins", () => {
        expect(scenePicker.pick("merge-sort", 0)).toBe("merge-sort");
    });

    it("givenAnUnknownScene_whenPicking_thenChanceDecides", () => {
        expect(scenePicker.pick("ripple-adder", 0)).toBe("avl-tree");
        expect(scenePicker.pick(null, 0.5)).toBe("merge-sort");
        expect(scenePicker.pick(null, 0.9999)).toBe("hash-table");
    });
});
