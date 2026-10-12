import type { InstanceFactory } from "./InstanceFactory.ts";
import type { ResolutionKey } from "./ResolutionKey.ts";

export class InstanceFactoryRegistry {
    private readonly factories: Map<unknown, InstanceFactory<unknown>>;

    public constructor() {
        this.factories = new Map<unknown, InstanceFactory<unknown>>();
    }

    public bind<T>(key: ResolutionKey<T>, instanceFactory: InstanceFactory<T>): void {
        this.factories.set(key, instanceFactory);
    }

    public factoryOf<T>(key: ResolutionKey<T>): InstanceFactory<T> | null {
        return (this.factories.get(key) as InstanceFactory<T> | undefined) ?? null;
    }
}
