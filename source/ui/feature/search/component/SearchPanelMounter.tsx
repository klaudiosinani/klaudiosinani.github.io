import { createRoot } from "react-dom/client";
import CommandPalette from "./CommandPalette";

export class SearchPanelMounter {
    public mount(): void {
        const host: HTMLDivElement = document.createElement("div");

        document.body.appendChild(host);
        createRoot(host).render(<CommandPalette opened={true} />);
    }
}

export const SEARCH_PANEL_MOUNTER: SearchPanelMounter = new SearchPanelMounter();
