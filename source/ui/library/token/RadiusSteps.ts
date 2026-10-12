import { RadiusStep } from "./RadiusStep";

export const RADIUS_STEPS: readonly RadiusStep[] = [
    new RadiusStep("mark", "rounded-mark", "0.125rem", "A day in the calendar of contributions."),
    new RadiusStep("thumbnail", "rounded-thumbnail", "0.1875rem", "The mark of a publisher, beside its name."),
    new RadiusStep("sm", "rounded-sm", "0.25rem", "A word set in code inside a line of running text."),
    new RadiusStep("md", "rounded-md", "0.375rem", "A chip, a key, and the option of a row that is pressed."),
    new RadiusStep("lg", "rounded-lg", "0.5rem", "A control, a well of figures, a menu, a box that holds a command."),
    new RadiusStep("xl", "rounded-xl", "0.75rem", "A card, the search field, and the panel that takes the page."),
    new RadiusStep("full", "rounded-full", "9999px", "A dot, a node on a rail, and the bar of a language mix."),
];
