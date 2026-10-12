export interface SearchMatch {
    readonly key?: string;
    readonly indices: readonly (readonly [number, number])[];
}
