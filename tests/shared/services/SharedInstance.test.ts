import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { SharedInstance } from "@app/infrastructure/SharedInstance";

type Make = () => { name: string };

describe("SharedInstance.get", () => {
    it("givenTheFirstCall_whenAsked_thenTheServiceIsMade", () => {
        const make: Mock<Make> = vi.fn<Make>(() => ({ name: "service" }));
        const underTest: SharedInstance<{ name: string }> = new SharedInstance(make);

        expect(underTest.get()).toEqual({ name: "service" });
        expect(make).toHaveBeenCalledOnce();
    });

    it("givenASecondCall_whenAsked_thenTheSameOneIsServed", () => {
        const make: Mock<Make> = vi.fn<Make>(() => ({ name: "service" }));
        const underTest: SharedInstance<{ name: string }> = new SharedInstance(make);

        const first: { name: string } = underTest.get();
        const second: { name: string } = underTest.get();

        expect(second).toBe(first);
        expect(make).toHaveBeenCalledOnce();
    });

    it("givenTwoHolders_whenAsked_thenEachHoldsItsOwn", () => {
        const first: SharedInstance<{ name: string }> = new SharedInstance(() => ({
            name: "one",
        }));
        const second: SharedInstance<{ name: string }> = new SharedInstance(() => ({
            name: "two",
        }));

        expect(first.get()).not.toBe(second.get());
    });
});
