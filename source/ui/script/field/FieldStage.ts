import type { FieldData } from "@app/feature/field/FieldData";
import type { FieldScene } from "./FieldScene";
import type { FieldSceneKey } from "./FieldSceneKey";
import { FieldDataParser } from "./FieldDataParser";
import { FieldPaletteReader } from "./FieldPaletteReader";
import { FieldPlayer } from "./FieldPlayer";
import { FieldSceneFactory } from "./FieldSceneFactory";
import { FieldSurface } from "./FieldSurface";
import { NumberFormatter } from "@app/util/text/NumberFormatter";
import { SceneBoxFactory } from "./SceneBoxFactory";
import { ScenePicker } from "./ScenePicker";

export class FieldStage {
    private readonly STAGE: string = "[data-field-stage]";
    private readonly DATA: string = "script[data-field-data]";
    private readonly CANVAS: string = "canvas[data-field-canvas]";
    private readonly REQUEST: string = "field";

    private readonly scenePicker: ScenePicker;
    private readonly fieldSceneFactory: FieldSceneFactory;
    private readonly fieldDataParser: FieldDataParser;
    private readonly fieldPaletteReader: FieldPaletteReader;

    public constructor(
        scenePicker: ScenePicker,
        fieldSceneFactory: FieldSceneFactory,
        fieldDataParser: FieldDataParser,
        fieldPaletteReader: FieldPaletteReader
    ) {
        this.scenePicker = scenePicker;
        this.fieldSceneFactory = fieldSceneFactory;
        this.fieldDataParser = fieldDataParser;
        this.fieldPaletteReader = fieldPaletteReader;
    }

    public mount(): void {
        const dataScript: HTMLScriptElement | null = document.querySelector(this.DATA);

        if (dataScript === null) {
            return;
        }

        const fieldData: FieldData = this.fieldDataParser.parse(dataScript.textContent ?? "");

        document
            .querySelectorAll<HTMLElement>(this.STAGE)
            .forEach((stage: HTMLElement) => this.mountStage(stage, fieldData));
    }

    private mountStage(stage: HTMLElement, fieldData: FieldData): void {
        const canvas: HTMLCanvasElement | null = stage.querySelector(this.CANVAS);
        const canvasRenderingContext2D: CanvasRenderingContext2D | null = canvas?.getContext("2d") ?? null;

        if (canvas === null || canvasRenderingContext2D === null) {
            return;
        }

        const fieldSceneKey: FieldSceneKey = this.scenePicker.pick(
            stage.dataset.fieldScene ?? new URLSearchParams(window.location.search).get(this.REQUEST),
            Math.random()
        );
        const fieldScene: FieldScene = this.fieldSceneFactory.create(fieldSceneKey, fieldData);

        new FieldPlayer(
            stage,
            canvas,
            new FieldSurface(canvas, canvasRenderingContext2D),
            fieldScene,
            this.fieldPaletteReader
        ).play(fieldSceneKey);
    }
}

export const FIELD_STAGE: FieldStage = new FieldStage(
    new ScenePicker(),
    new FieldSceneFactory(new NumberFormatter(), new SceneBoxFactory()),
    new FieldDataParser(),
    new FieldPaletteReader()
);
