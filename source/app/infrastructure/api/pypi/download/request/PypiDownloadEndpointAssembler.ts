export class PypiDownloadEndpointAssembler {
    public assembleRecent(packageName: string): string {
        return `${packageName}/recent`;
    }

    public assembleOverall(packageName: string): string {
        return `${packageName}/overall`;
    }
}
