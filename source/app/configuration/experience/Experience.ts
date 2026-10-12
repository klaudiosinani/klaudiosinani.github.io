import type { ExperienceLink } from "./ExperienceLink";
import type { ExperienceRole } from "./ExperienceRole";

export class Experience {
    private readonly organisation: string;
    private readonly url: string | undefined;
    private readonly mark: string;
    private readonly location: string;
    private readonly page: ExperienceLink | undefined;
    private readonly commitment: string;
    private readonly roles: readonly ExperienceRole[];

    public constructor(
        organisation: string,
        url: string | undefined,
        mark: string,
        location: string,
        page: ExperienceLink | undefined,
        commitment: string,
        roles: readonly ExperienceRole[]
    ) {
        this.organisation = organisation;
        this.url = url;
        this.mark = mark;
        this.location = location;
        this.page = page;
        this.commitment = commitment;
        this.roles = roles;
    }

    public getOrganisation(): string {
        return this.organisation;
    }
    public getUrl(): string | undefined {
        return this.url;
    }
    public getMark(): string {
        return this.mark;
    }
    public getLocation(): string {
        return this.location;
    }
    public getPage(): ExperienceLink | undefined {
        return this.page;
    }
    public getCommitment(): string {
        return this.commitment;
    }
    public getRoles(): readonly ExperienceRole[] {
        return this.roles;
    }
}
