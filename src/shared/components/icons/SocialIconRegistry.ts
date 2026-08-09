import github from "@assets/icons/github.svg?raw";
import facebook from "@assets/icons/facebook.svg?raw";
import instagram from "@assets/icons/instagram.svg?raw";
import linkedin from "@assets/icons/linkedin.svg?raw";
import mail from "@assets/icons/mail.svg?raw";
import twitter from "@assets/icons/twitter.svg?raw";
import twitch from "@assets/icons/twitch.svg?raw";
import youtube from "@assets/icons/youtube.svg?raw";
import whatsapp from "@assets/icons/whatsapp.svg?raw";
import snapchat from "@assets/icons/snapchat.svg?raw";
import pinterest from "@assets/icons/pinterest.svg?raw";
import tiktok from "@assets/icons/tiktok.svg?raw";
import codepen from "@assets/icons/codepen.svg?raw";
import discord from "@assets/icons/discord.svg?raw";
import gitlab from "@assets/icons/gitlab.svg?raw";
import reddit from "@assets/icons/reddit.svg?raw";
import skype from "@assets/icons/skype.svg?raw";
import steam from "@assets/icons/steam.svg?raw";
import telegram from "@assets/icons/telegram.svg?raw";
import mastodon from "@assets/icons/mastodon.svg?raw";
import rss from "@assets/icons/rss.svg?raw";
import git from "@assets/icons/git.svg?raw";
import type { SocialIconName } from "./SocialIconName";

export class SocialIconRegistry {
  private static readonly ICONS: Record<SocialIconName, string> = {
    Github: github,
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
    Git: git,
  };

  public static resolve(name: SocialIconName): string {
    return SocialIconRegistry.ICONS[name];
  }
}
