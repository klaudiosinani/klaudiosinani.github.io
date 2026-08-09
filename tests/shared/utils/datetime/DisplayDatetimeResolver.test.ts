import { describe, expect, it } from "vitest";
import { DisplayDatetimeResolver } from "@utils/datetime/DisplayDatetimeResolver";

const underTest = DisplayDatetimeResolver;

describe("DisplayDatetimeResolver.isUpdated", () => {
  const pub = "2026-01-01T00:00:00Z";

  it("givenANullModificationDate_whenCheckingIfUpdated_thenItIsFalse", () => {
    // when
    const updated = underTest.isUpdated(pub, null);

    // then
    expect(updated).toBe(false);
  });

  it("givenNoModificationDate_whenCheckingIfUpdated_thenItIsFalse", () => {
    // when
    const updated = underTest.isUpdated(pub, undefined);

    // then
    expect(updated).toBe(false);
  });

  it("givenAModificationAfterPublication_whenCheckingIfUpdated_thenItIsTrue", () => {
    // when
    const updated = underTest.isUpdated(pub, "2026-01-02T00:00:00Z");

    // then
    expect(updated).toBe(true);
  });

  it("givenAModificationBeforePublication_whenCheckingIfUpdated_thenItIsFalse", () => {
    // when
    const updated = underTest.isUpdated(pub, "2025-12-31T00:00:00Z");

    // then
    expect(updated).toBe(false);
  });

  it("givenIdenticalStamps_whenCheckingIfUpdated_thenItIsFalse", () => {
    // when
    const updated = underTest.isUpdated(pub, pub);

    // then
    expect(updated).toBe(false);
  });

  it("givenMixedStringAndDateValues_whenCheckingIfUpdated_thenTheyCompareEqually", () => {
    // when
    const updated = underTest.isUpdated(new Date(pub), "2026-01-02T00:00:00Z");

    // then
    expect(updated).toBe(true);
  });
});

describe("DisplayDatetimeResolver.resolve", () => {
  const pub = "2026-01-01T00:00:00Z";
  const mod = "2026-01-02T00:00:00Z";

  it("givenAnUpdatedEntry_whenResolvingTheDisplayStamp_thenTheModificationIsUsed", () => {
    // when
    const resolved = underTest.resolve(pub, mod);

    // then
    expect(resolved).toBe(mod);
  });

  it("givenNoModificationDate_whenResolvingTheDisplayStamp_thenPublicationIsUsed", () => {
    // when
    const resolved = underTest.resolve(pub, null);

    // then
    expect(resolved).toBe(pub);
  });

  it("givenAModificationBeforePublication_whenResolvingTheDisplayStamp_thenPublicationIsUsed", () => {
    // when
    const resolved = underTest.resolve(pub, "2025-12-31T00:00:00Z");

    // then
    expect(resolved).toBe(pub);
  });
});
