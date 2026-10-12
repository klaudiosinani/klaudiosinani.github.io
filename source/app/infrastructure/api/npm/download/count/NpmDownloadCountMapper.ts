import { NpmDownloadCount } from "./NpmDownloadCount.ts";
import type { NpmDownloadDto } from "../response/NpmDownloadDto.ts";

export class NpmDownloadCountMapper {
    public map(npmDownloadDto: NpmDownloadDto): NpmDownloadCount {
        return new NpmDownloadCount(npmDownloadDto.getDay(), npmDownloadDto.getDownloads());
    }
}
