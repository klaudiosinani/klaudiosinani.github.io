import { SpaceStep } from "./SpaceStep";

export const SPACE_STEPS: readonly SpaceStep[] = [
    new SpaceStep("tight", "gap-tight", "5px", "5px", "A name over its note, and a label over its value."),
    new SpaceStep("inline", "gap-inline", "8px", "8px", "Two controls on one line, and an icon beside its word."),
    new SpaceStep("text", "gap-text", "13px", "13px", "Two lines of one part, and a kicker over its title."),
    new SpaceStep("part", "gap-part", "21px", "21px", "Two parts of one card, and two cards of one grid."),
    new SpaceStep("head", "gap-head", "34px", "34px", "A head over its content, and the inset of a panel."),
    new SpaceStep("group", "gap-group", "55px", "34px", "Two groups of one section."),
    new SpaceStep("section", "gap-section", "89px", "55px", "Two sections of a page, and the inset of a band."),
];
