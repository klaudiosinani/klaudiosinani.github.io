import { RepositoryOgDetails } from "./RepositoryOgDetails";
import { RepositoryOgFigure } from "./RepositoryOgFigure";

export class RepositoryOgDetailsAssembler {
    public assemble(payload: unknown): RepositoryOgDetails {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const name: unknown = record.name;
        const logline: unknown = record.logline;
        const version: unknown = record.version;
        const address: unknown = record.address;

        return new RepositoryOgDetails(
            typeof name === "string" ? name : "",
            typeof logline === "string" ? logline : "",
            typeof version === "string" ? version : null,
            typeof address === "string" ? address : "",
            this.figures(record.figures)
        );
    }

    private figures(payload: unknown): RepositoryOgFigure[] {
        if (!Array.isArray(payload)) {
            return [];
        }

        return payload.map((entry: unknown) => {
            const record: Record<string, unknown> = (entry ?? {}) as Record<string, unknown>;
            const value: unknown = record.value;
            const label: unknown = record.label;

            return new RepositoryOgFigure(
                typeof value === "string" ? value : "",
                typeof label === "string" ? label : ""
            );
        });
    }
}
