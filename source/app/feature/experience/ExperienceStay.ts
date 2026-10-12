import type { HeldPost } from "./HeldPost";
import type { EmploymentDuration } from "./EmploymentDuration";
import type { Experience } from "@app/configuration/experience/Experience";

export class ExperienceStay {
    private readonly at: Experience;
    private readonly span: EmploymentDuration;
    private readonly posts: readonly HeldPost[];

    public constructor(at: Experience, span: EmploymentDuration, posts: readonly HeldPost[]) {
        this.at = at;
        this.span = span;
        this.posts = posts;
    }

    public getAt(): Experience {
        return this.at;
    }
    public getSpan(): EmploymentDuration {
        return this.span;
    }
    public getPosts(): readonly HeldPost[] {
        return this.posts;
    }
}
