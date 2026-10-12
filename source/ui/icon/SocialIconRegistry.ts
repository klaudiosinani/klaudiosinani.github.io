import github from "@ui/asset/icons/Github.svg?raw";
import facebook from "@ui/asset/icons/Facebook.svg?raw";
import instagram from "@ui/asset/icons/Instagram.svg?raw";
import linkedin from "@ui/asset/icons/LinkedIn.svg?raw";
import mail from "@ui/asset/icons/Mail.svg?raw";
import twitter from "@ui/asset/icons/Twitter.svg?raw";
import twitch from "@ui/asset/icons/Twitch.svg?raw";
import youtube from "@ui/asset/icons/YouTube.svg?raw";
import whatsapp from "@ui/asset/icons/WhatsApp.svg?raw";
import snapchat from "@ui/asset/icons/Snapchat.svg?raw";
import pinterest from "@ui/asset/icons/Pinterest.svg?raw";
import tiktok from "@ui/asset/icons/TikTok.svg?raw";
import codepen from "@ui/asset/icons/CodePen.svg?raw";
import discord from "@ui/asset/icons/Discord.svg?raw";
import gitlab from "@ui/asset/icons/GitLab.svg?raw";
import reddit from "@ui/asset/icons/Reddit.svg?raw";
import skype from "@ui/asset/icons/Skype.svg?raw";
import steam from "@ui/asset/icons/Steam.svg?raw";
import telegram from "@ui/asset/icons/Telegram.svg?raw";
import mastodon from "@ui/asset/icons/Mastodon.svg?raw";
import rss from "@ui/asset/icons/RSS.svg?raw";
import type { SocialIconName } from "./SocialIconName";

export class SocialIconRegistry {
    private readonly ICONS: Record<SocialIconName, string> = {
        GitHub: github,
        Facebook: facebook,
        Instagram: instagram,
        LinkedIn: linkedin,
        Mail: mail,
        Twitter: twitter,
        Twitch: twitch,
        YouTube: youtube,
        WhatsApp: whatsapp,
        Snapchat: snapchat,
        Pinterest: pinterest,
        TikTok: tiktok,
        CodePen: codepen,
        Discord: discord,
        GitLab: gitlab,
        Reddit: reddit,
        Skype: skype,
        Steam: steam,
        Telegram: telegram,
        Mastodon: mastodon,
        RSS: rss,
    };

    public resolve(name: SocialIconName): string {
        return this.ICONS[name];
    }
}

export const SOCIAL_ICON_REGISTRY: SocialIconRegistry = new SocialIconRegistry();
