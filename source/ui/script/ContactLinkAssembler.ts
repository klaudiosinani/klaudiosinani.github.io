export class ContactLinkAssembler {
    private readonly TARGET: string = "a[data-contact-user][data-contact-host]";

    public mount(): void {
        document.querySelectorAll<HTMLAnchorElement>(this.TARGET).forEach((anchor: HTMLAnchorElement) => {
            const subject: string = anchor.dataset.contactSubject ?? "";
            const query: string = subject === "" ? "" : `?subject=${encodeURIComponent(subject)}`;

            anchor.href = `mailto:${anchor.dataset.contactUser}@${anchor.dataset.contactHost}${query}`;
        });
    }
}

export const CONTACT_LINK_ASSEMBLER: ContactLinkAssembler = new ContactLinkAssembler();
