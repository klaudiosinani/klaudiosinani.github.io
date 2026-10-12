import type { SectorKey } from "@app/configuration/sector/SectorKey";

export interface FeaturedSoftware {
    name: string;
    logline: string;
    description: string;
    url: string;
    order: number;
    sector: SectorKey;
    featured: boolean;
    seoTitle?: string;
}
