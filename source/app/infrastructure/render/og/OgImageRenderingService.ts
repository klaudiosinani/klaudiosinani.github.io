import { Resvg } from "@resvg/resvg-js";
import type { CollectionEntry } from "astro:content";
import type { PageOgDetails } from "./details/PageOgDetails.ts";
import type { RepositoryOgDetails } from "./details/RepositoryOgDetails.ts";
import pageOgImage from "./template/PageOgImage";
import postOgImage from "./template/PostOgImage";
import repositoryOgImage from "./template/RepositoryOgImage";
import siteOgImage from "./template/SiteOgImage";

export class OgImageRenderingService {
    public async renderPost(post: CollectionEntry<"blog">): Promise<Uint8Array<ArrayBuffer>> {
        const svg: string = await postOgImage(post);

        return this.toPng(svg);
    }

    public async renderRepository(repositoryOgDetails: RepositoryOgDetails): Promise<Uint8Array<ArrayBuffer>> {
        const svg: string = await repositoryOgImage(repositoryOgDetails);

        return this.toPng(svg);
    }

    public async renderPage(pageOgDetails: PageOgDetails): Promise<Uint8Array<ArrayBuffer>> {
        const svg: string = await pageOgImage(pageOgDetails);

        return this.toPng(svg);
    }

    public async renderSite(): Promise<Uint8Array<ArrayBuffer>> {
        const svg: string = await siteOgImage();

        return this.toPng(svg);
    }

    private toPng(svg: string): Uint8Array<ArrayBuffer> {
        return new Uint8Array(new Resvg(svg).render().asPng());
    }
}
