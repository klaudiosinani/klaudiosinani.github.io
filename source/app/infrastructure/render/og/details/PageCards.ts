import { PAGE_DESCRIPTIONS } from "@app/configuration/page/PageDescriptions";
import { ROUTES } from "@app/configuration/route/Routes";
import { PageOgDetails } from "./PageOgDetails.ts";
import type { PageOgAddressAssembler } from "./PageOgAddressAssembler.ts";

export class PageCards {
    private readonly pageOgAddressAssembler: PageOgAddressAssembler;

    public constructor(pageOgAddressAssembler: PageOgAddressAssembler) {
        this.pageOgAddressAssembler = pageOgAddressAssembler;
    }

    public getAll(): Readonly<Record<string, PageOgDetails>> {
        return {
            activity: new PageOgDetails(
                "Activity",
                PAGE_DESCRIPTIONS.activity,
                this.pageOgAddressAssembler.assemble(ROUTES.activity)
            ),
            software: new PageOgDetails(
                "Software",
                PAGE_DESCRIPTIONS.software,
                this.pageOgAddressAssembler.assemble(ROUTES.software)
            ),
            "software-archive": new PageOgDetails(
                "All Software",
                PAGE_DESCRIPTIONS.softwareArchive,
                this.pageOgAddressAssembler.assemble(ROUTES.softwareArchive)
            ),
            publications: new PageOgDetails(
                "Publications",
                PAGE_DESCRIPTIONS.publications,
                this.pageOgAddressAssembler.assemble(ROUTES.publications)
            ),
            press: new PageOgDetails(
                "In the Press",
                PAGE_DESCRIPTIONS.press,
                this.pageOgAddressAssembler.assemble(ROUTES.press)
            ),
            about: new PageOgDetails(
                "About",
                PAGE_DESCRIPTIONS.about,
                this.pageOgAddressAssembler.assemble(ROUTES.about)
            ),
            contributions: new PageOgDetails(
                "Contributions",
                PAGE_DESCRIPTIONS.contributions,
                this.pageOgAddressAssembler.assemble(`${ROUTES.experience}/sonarqube`)
            ),
            thanks: new PageOgDetails(
                "Thanks",
                PAGE_DESCRIPTIONS.thanks,
                this.pageOgAddressAssembler.assemble(ROUTES.thanks)
            ),
            partners: new PageOgDetails(
                "Partners",
                PAGE_DESCRIPTIONS.partners,
                this.pageOgAddressAssembler.assemble(ROUTES.partners)
            ),
            search: new PageOgDetails(
                "Search",
                PAGE_DESCRIPTIONS.search,
                this.pageOgAddressAssembler.assemble(ROUTES.search)
            ),
            index: new PageOgDetails(
                "Index",
                PAGE_DESCRIPTIONS.tags,
                this.pageOgAddressAssembler.assemble(ROUTES.tags)
            ),
            "not-found": new PageOgDetails(
                "Page not found",
                PAGE_DESCRIPTIONS.notFound,
                this.pageOgAddressAssembler.assemble("")
            ),
        };
    }
}
