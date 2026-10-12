import type { InstanceFactory } from "./InstanceFactory.ts";
import type { InstanceFactoryRegistry } from "./InstanceFactoryRegistry.ts";
import type { InstanceStore } from "./InstanceStore.ts";
import type { ResolutionKey } from "./ResolutionKey.ts";
import type { ResolutionKeyName } from "./ResolutionKeyName.ts";

export class InstanceResolver {
    private readonly instanceFactoryRegistry: InstanceFactoryRegistry;
    private readonly instanceStore: InstanceStore;
    private readonly resolutionKeyName: ResolutionKeyName;

    public constructor(
        instanceFactoryRegistry: InstanceFactoryRegistry,
        instanceStore: InstanceStore,
        resolutionKeyName: ResolutionKeyName
    ) {
        this.instanceFactoryRegistry = instanceFactoryRegistry;
        this.instanceStore = instanceStore;
        this.resolutionKeyName = resolutionKeyName;
    }

    public resolve<T>(key: ResolutionKey<T>): T {
        if (this.instanceStore.holds(key)) {
            return this.instanceStore.held(key);
        }

        const instanceFactory: InstanceFactory<T> | null = this.instanceFactoryRegistry.factoryOf(key);

        if (!instanceFactory) {
            throw new Error(`Nothing answers for ${this.resolutionKeyName.of(key)}.`);
        }

        const made: T = instanceFactory();

        this.instanceStore.keep(key, made);

        return made;
    }
}
