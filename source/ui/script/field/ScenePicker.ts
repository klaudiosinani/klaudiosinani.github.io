import type { FieldSceneKey } from "./FieldSceneKey";
import { FIELD_SCENE_KEYS } from "./FieldSceneKeys";

export class ScenePicker {
    public pick(requested: string | null, random: number): FieldSceneKey {
        const requestedKey: FieldSceneKey | undefined = FIELD_SCENE_KEYS.find(
            (fieldSceneKey: FieldSceneKey) => fieldSceneKey === requested
        );

        if (requestedKey) {
            return requestedKey;
        }

        return FIELD_SCENE_KEYS[Math.min(FIELD_SCENE_KEYS.length - 1, Math.floor(random * FIELD_SCENE_KEYS.length))];
    }
}
