import { CONTACT_ADDRESS } from "@app/configuration/contact/SiteContactAddress";
import { GITHUB_USERNAME } from "@app/configuration/author/GitHubUsername";

export class PartnerConfiguration {
    private readonly README_REPOSITORIES: readonly string[] = ["signale", "taskbook"];
    private readonly CONTACT_SUBJECT: string = "Partnership";
    private readonly DEFAULT_BRAND: string = "Your brand";

    public getReadmeRepositories(): readonly string[] {
        return this.README_REPOSITORIES;
    }

    public getProfileAddress(): string {
        return `github.com/${GITHUB_USERNAME}`;
    }

    public getContactUser(): string {
        return CONTACT_ADDRESS.getUser();
    }

    public getContactHost(): string {
        return CONTACT_ADDRESS.getHost();
    }

    public getContactSubject(): string {
        return this.CONTACT_SUBJECT;
    }

    public getDefaultBrand(): string {
        return this.DEFAULT_BRAND;
    }
}
