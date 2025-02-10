import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://klaudiosinani.com/",
  author: "Klaudio Sinani",
  profile: "https://klaudiosinani.com/",
  desc: "Definite and vague reflections for humans and machines.",
  title: "Klaudio Sinani",
  ogImage: "header.jpeg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes,
  googleSiteVerification: "O0W6AXDlyi2YDtR5ZriJsxii7-UHdy363XJd95Vdi0M"
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: false,
  width: 60,
  height: 60,
};

export const USE_SOCIALS_IN_HEADER: boolean = false;

export const SOCIALS: SocialObjects = [
  {
    name: "Git",
    href: "https://github.com/klaudiosinani",
    linkTitle: `Code`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:klaudiosinani [at] protonmail [dot] ch",
    linkTitle: `Send an email`,
    active: true,
  },
  {
    name: "RSS",
    href: "/rss.xml",
    linkTitle: "RSS Feed",
    active: true,
  },
];
