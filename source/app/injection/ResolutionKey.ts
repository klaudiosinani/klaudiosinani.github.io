import type { Constructor } from "./Constructor.ts";
import type { InjectionKey } from "./InjectionKey.ts";

export type ResolutionKey<T> = Constructor<T> | InjectionKey<T>;
