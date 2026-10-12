import { DataSource } from "@app/infrastructure/common/DataSource.ts";
import { InstanceFactoryRegistry } from "@app/injection/InstanceFactoryRegistry.ts";
import { InstanceResolver } from "@app/injection/InstanceResolver.ts";
import { InstanceStore } from "@app/injection/InstanceStore.ts";
import { ResolutionKeyName } from "@app/injection/ResolutionKeyName.ts";
import { bindConfiguration } from "@app/bindings/ConfigurationBindings.ts";
import { bindFeature } from "@app/bindings/FeatureBindings.ts";
import { bindField } from "@app/bindings/FieldBindings.ts";
import { bindInfrastructure } from "@app/bindings/InfrastructureBindings.ts";
import { bindPartner } from "@app/bindings/PartnerBindings.ts";
import { bindPort } from "@app/bindings/PortBindings.ts";
import { bindReach } from "@app/bindings/ReachBindings.ts";
import { bindSector } from "@app/bindings/SectorBindings.ts";
import { bindUtil } from "@app/bindings/UtilBindings.ts";

const registry: InstanceFactoryRegistry = new InstanceFactoryRegistry();
const resolver: InstanceResolver = new InstanceResolver(registry, new InstanceStore(), new ResolutionKeyName());

bindUtil(registry, resolver);
bindInfrastructure(registry, resolver);
bindFeature(registry, resolver);
bindConfiguration(registry);
bindReach(registry, resolver);
bindPartner(registry, resolver);
bindSector(registry, resolver);
bindField(registry, resolver);
bindPort(registry, resolver, new DataSource().isCaching());

export const CONTEXT: InstanceResolver = resolver;
