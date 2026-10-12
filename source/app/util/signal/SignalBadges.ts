import type { SignalType } from "./SignalType";

export const SIGNAL_BADGES: Readonly<Record<SignalType, string>> = {
    success: "✔",
    star: "★",
    info: "ℹ",
    complete: "☒",
    fav: "❤",
};
