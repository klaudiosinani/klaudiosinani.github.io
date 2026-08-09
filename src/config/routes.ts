export const ROUTES = {
  home: "/",
  publications: "/publications",
  tags: "/index",
  software: "/software",
  softwareArchive: "/software/all",
  press: "/press",
  about: "/about",
  thanks: "/thanks",
  search: "/search",
} as const;

export const NAV_ITEMS = [
  { key: "posts", label: "Publications", href: `${ROUTES.publications}/` },
  { key: "software", label: "Software", href: `${ROUTES.software}/` },
  { key: "about", label: "About", href: `${ROUTES.about}/` },
] as const;
