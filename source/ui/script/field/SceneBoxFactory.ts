import { FieldBox } from "./FieldBox";

export class SceneBoxFactory {
    public create(width: number, height: number): FieldBox {
        return new FieldBox(width * 0.04, height * 0.08, width * 0.92, height * 0.82);
    }
}
