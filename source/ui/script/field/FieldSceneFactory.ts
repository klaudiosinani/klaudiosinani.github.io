import type { FieldData } from "@app/feature/field/FieldData";
import type { FieldScene } from "./FieldScene";
import type { FieldSceneKey } from "./FieldSceneKey";
import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import { AvlTreeLayout } from "./scene/tree/AvlTreeLayout";
import { AvlTreeScene } from "./scene/tree/AvlTreeScene";
import { BinaryHeapScene } from "./scene/heap/BinaryHeapScene";
import { HashTablePlanner } from "./scene/hash/HashTablePlanner";
import { HashTableScene } from "./scene/hash/HashTableScene";
import { HeapLayout } from "./scene/heap/HeapLayout";
import { HeapPlanner } from "./scene/heap/HeapPlanner";
import { MergeSortPlanner } from "./scene/merge/MergeSortPlanner";
import { MergeSortScene } from "./scene/merge/MergeSortScene";
import { SceneBoxFactory } from "./SceneBoxFactory";

export class FieldSceneFactory {
    private readonly numberFormatter: NumberFormatter;
    private readonly sceneBoxFactory: SceneBoxFactory;

    public constructor(numberFormatter: NumberFormatter, sceneBoxFactory: SceneBoxFactory) {
        this.numberFormatter = numberFormatter;
        this.sceneBoxFactory = sceneBoxFactory;
    }

    public create(fieldSceneKey: FieldSceneKey, fieldData: FieldData): FieldScene {
        switch (fieldSceneKey) {
            case "binary-heap":
                return new BinaryHeapScene(
                    fieldData,
                    new HeapPlanner(),
                    new HeapLayout(),
                    this.sceneBoxFactory,
                    this.numberFormatter
                );
            case "merge-sort":
                return new MergeSortScene(
                    fieldData,
                    new MergeSortPlanner(),
                    this.sceneBoxFactory,
                    this.numberFormatter
                );
            case "hash-table":
                return new HashTableScene(
                    fieldData,
                    new HashTablePlanner(),
                    this.sceneBoxFactory,
                    this.numberFormatter
                );
            default:
                return new AvlTreeScene(fieldData, new AvlTreeLayout(), this.sceneBoxFactory, this.numberFormatter);
        }
    }
}
