import { describe, expect, it } from "vitest";
import { RequestHeaders } from "@app/infrastructure/http/domain/RequestHeaders";

describe("RequestHeaders", () => {
    it("givenARecord_whenReadBack_thenItHoldsTheSameNamesAndValues", () => {
        const underTest: RequestHeaders = new RequestHeaders({ Accept: "text/*" });

        expect(underTest.toRecord()).toEqual({ Accept: "text/*" });
    });

    it("givenTwoSets_whenMerged_thenBothAreCarried", () => {
        const underTest: RequestHeaders = new RequestHeaders({ Accept: "text/*" });

        const merged: RequestHeaders = underTest.merge(new RequestHeaders({ Authorization: "Bearer secret" }));

        expect(merged.toRecord()).toEqual({
            Accept: "text/*",
            Authorization: "Bearer secret",
        });
    });

    it("givenTwoSetsThatNameOneHeader_whenMerged_thenTheValueOfTheOtherWins", () => {
        const underTest: RequestHeaders = new RequestHeaders({
            Authorization: "Bearer shared",
        });

        const merged: RequestHeaders = underTest.merge(new RequestHeaders({ Authorization: "Bearer own" }));

        expect(merged.toRecord().Authorization).toBe("Bearer own");
    });

    it("givenASet_whenMerged_thenTheSetItselfDoesNotChange", () => {
        const underTest: RequestHeaders = new RequestHeaders({ Accept: "text/*" });

        underTest.merge(new RequestHeaders({ Accept: "application/json" }));

        expect(underTest.toRecord()).toEqual({ Accept: "text/*" });
    });

    it("givenTheRecordItWasMadeFrom_whenThatRecordChanges_thenTheHeadersDoNot", () => {
        const stated: Record<string, string> = { Accept: "text/*" };
        const underTest: RequestHeaders = new RequestHeaders(stated);

        stated.Accept = "application/json";

        expect(underTest.toRecord().Accept).toBe("text/*");
    });

    it("givenAFixedSet_whenAskedForItsHeaders_thenItStatesItself", () => {
        const underTest: RequestHeaders = new RequestHeaders({ Accept: "text/*" });

        expect(underTest.headers()).toBe(underTest);
    });
});
