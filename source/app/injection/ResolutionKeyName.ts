import { InjectionKey } from "./InjectionKey.ts";
import type { ResolutionKey } from "./ResolutionKey.ts";

export class ResolutionKeyName {
    public of<T>(key: ResolutionKey<T>): string {
        return key instanceof InjectionKey ? key.getName() : key.name;
    }
}
