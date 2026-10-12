import type { EmploymentDurationFormatter } from "@app/feature/experience/EmploymentDurationFormatter";
import type { Experience } from "@app/configuration/experience/Experience";
import type { ExperienceRole } from "@app/configuration/experience/ExperienceRole";
import { ExperienceStay } from "./ExperienceStay";
import { HeldPost } from "./HeldPost";

export class ExperienceStayFactory {
    private readonly employmentDurationFormatter: EmploymentDurationFormatter;

    public constructor(employmentDurationFormatter: EmploymentDurationFormatter) {
        this.employmentDurationFormatter = employmentDurationFormatter;
    }
    public create(experience: readonly Experience[], today: Date): ExperienceStay[] {
        return experience.map(
            (at: Experience) =>
                new ExperienceStay(
                    at,
                    this.employmentDurationFormatter.across(at.getRoles(), today),
                    this.posts(at, today)
                )
        );
    }

    private posts(at: Experience, today: Date): HeldPost[] {
        return at
            .getRoles()
            .map(
                (role: ExperienceRole) =>
                    new HeldPost(role, this.employmentDurationFormatter.format(role.getFrom(), role.getTo(), today))
            );
    }
}
