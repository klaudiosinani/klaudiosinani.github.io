import { EmphasisStep } from "./EmphasisStep";

export const EMPHASIS_STEPS: readonly EmphasisStep[] = [
    new EmphasisStep("loud", "opacity-100", 100, "The words themselves, and anything under the pointer."),
    new EmphasisStep("clear", "opacity-90", 90, "The sentence that opens a page, and the logline of a project."),
    new EmphasisStep("plain", "opacity-80", 80, "A summary, a caption, and the text under a heading."),
    new EmphasisStep("quiet", "opacity-70", 70, "A label, a note, and a mark that stands beside words."),
    new EmphasisStep("faint", "opacity-60", 60, "A mark that must not take the eye from the words beside it."),
    new EmphasisStep("absent", "opacity-40", 40, "A figure no source answered for, and a control that cannot be used."),
    new EmphasisStep("hidden", "opacity-0", 0, "A thing the page has drawn but does not show yet."),
];
