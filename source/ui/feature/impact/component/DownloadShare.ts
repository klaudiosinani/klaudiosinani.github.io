import type { Outlet } from "@app/feature/impact/outlet/Outlet";

export interface DownloadShare {
    outlet: Outlet;
    name: string;
    value: number;
    share: number;
}
