import type { SocialIconName } from "@components/icons/SocialIconName";

export interface SocialLink {
  name: SocialIconName;
  href: string;
  linkTitle: string;
  active: boolean;
}
