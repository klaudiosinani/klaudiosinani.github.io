import { PageOgDetails } from "./PageOgDetails";

export class PageOgDetailsAssembler {
    public assemble(payload: unknown): PageOgDetails {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const title: unknown = record.title;
        const description: unknown = record.description;
        const address: unknown = record.address;

        return new PageOgDetails(
            typeof title === "string" ? title : "",
            typeof description === "string" ? description : "",
            typeof address === "string" ? address : ""
        );
    }
}
