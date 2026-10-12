import { SiteMetadata } from "./SiteMetadata";

const WEBSITE = "https://klaudiosinani.com/";
const AUTHOR = "Klaudio Sinani";
const DESCRIPTION =
    "The work of Klaudio Sinani in software engineering, open source software, software design & architecture, and computer science.";
const HOME_TITLE =
    "Klaudio Sinani - Software Engineering \u00b7 Open Source Software \u00b7 Software Design & Architecture \u00b7 Computer Science";
const OF_IMAGE = "og.png";
const START_YEAR = 2015;
const GOOGLE_SITE_VERIFICATION = "O0W6AXDlyi2YDtR5ZriJsxii7-UHdy363XJd95Vdi0M";

export const SITE: SiteMetadata = new SiteMetadata(
    WEBSITE,
    AUTHOR,
    WEBSITE,
    DESCRIPTION,
    AUTHOR,
    HOME_TITLE,
    OF_IMAGE,
    START_YEAR,
    GOOGLE_SITE_VERIFICATION
);
