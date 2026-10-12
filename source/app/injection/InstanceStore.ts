import type { ResolutionKey } from "./ResolutionKey.ts";

export class InstanceStore {
    private readonly instances: Map<unknown, unknown>;

    public constructor() {
        this.instances = new Map<unknown, unknown>();
    }

    public holds<T>(key: ResolutionKey<T>): boolean {
        return this.instances.has(key);
    }

    public held<T>(key: ResolutionKey<T>): T {
        return this.instances.get(key) as T;
    }

    public keep<T>(key: ResolutionKey<T>, instance: T): void {
        this.instances.set(key, instance);
    }
}
