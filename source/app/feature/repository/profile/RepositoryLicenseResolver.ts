export class RepositoryLicenseResolver {
    private readonly IDENTIFIER: RegExp = /^[A-Za-z0-9.+-]+$/;

    public resolve(license: string | null): string | null {
        return license && this.IDENTIFIER.test(license) ? `https://spdx.org/licenses/${license}.html` : null;
    }
}
