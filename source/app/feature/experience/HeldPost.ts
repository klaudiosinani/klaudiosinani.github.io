import type { EmploymentDuration } from "./EmploymentDuration";
import type { ExperienceRole } from "@app/configuration/experience/ExperienceRole";

export class HeldPost {
    private readonly role: ExperienceRole;
    private readonly span: EmploymentDuration;

    public constructor(role: ExperienceRole, span: EmploymentDuration) {
        this.role = role;
        this.span = span;
    }

    public getRole(): ExperienceRole {
        return this.role;
    }
    public getSpan(): EmploymentDuration {
        return this.span;
    }
}
