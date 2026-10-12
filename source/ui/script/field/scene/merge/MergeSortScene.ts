import type { FieldData } from "@app/feature/field/FieldData";
import type { FieldPalette } from "../../FieldPalette";
import type { FieldScene } from "../../FieldScene";
import type { MergeFrame } from "./MergeFrame";
import type { MergeSortPlanner } from "./MergeSortPlanner";
import type { MonthVolume } from "@app/feature/field/MonthVolume";
import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import type { SceneBoxFactory } from "../../SceneBoxFactory";
import { FieldBox } from "../../FieldBox";
import { FieldPoint } from "../../FieldPoint";
import { MarkFinder } from "../../MarkFinder";
import { MovingPoint } from "../../MovingPoint";
import { SceneCycle } from "../../SceneCycle";

export class MergeSortScene implements FieldScene {
    private readonly SECONDS_PER_FRAME: number = 0.22;
    private readonly LABEL_FONT: string = '500 10px "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif';
    private readonly LABEL_HEIGHT: number = 10;
    private readonly LABEL_GAP: number = 3;
    private readonly LABEL_SPACE: number = 3;
    private readonly LABEL_FADE: number = 0.2;
    private readonly START_FRAMES: number = 7;
    private readonly SORTED_FRAMES: number = 13;
    private readonly RETURN_FRAMES: number = 10;
    private readonly SMOOTHING: number = 7;
    private readonly GAP: number = 1;

    private readonly fieldData: FieldData;
    private readonly mergeSortPlanner: MergeSortPlanner;
    private readonly sceneBoxFactory: SceneBoxFactory;
    private readonly numberFormatter: NumberFormatter;
    private readonly markFinder: MarkFinder = new MarkFinder();
    private readonly mergeFrames: MergeFrame[];
    private readonly largestDownloads: number;
    private readonly passes: number;
    private readonly sceneCycle: SceneCycle;
    private fieldBox: FieldBox = new FieldBox(0, 0, 1, 1);
    private movingPoints: MovingPoint[] = [];
    private round: number = 0;
    private width: number = 1;
    private pointed: FieldPoint | null = null;

    public constructor(
        fieldData: FieldData,
        mergeSortPlanner: MergeSortPlanner,
        sceneBoxFactory: SceneBoxFactory,
        numberFormatter: NumberFormatter
    ) {
        const downloads: number[] = fieldData
            .getMonthVolumes()
            .map((monthVolume: MonthVolume) => monthVolume.getDownloads());

        this.fieldData = fieldData;
        this.mergeSortPlanner = mergeSortPlanner;
        this.sceneBoxFactory = sceneBoxFactory;
        this.numberFormatter = numberFormatter;
        this.mergeFrames = this.expanded(this.mergeSortPlanner.plan(downloads));
        this.largestDownloads = Math.max(1, ...downloads);
        this.passes = Math.ceil(Math.log2(Math.max(2, downloads.length)));
        this.sceneCycle = new SceneCycle(Math.max(1, this.mergeFrames.length), this.SECONDS_PER_FRAME, 0.001, 0);
    }

    public layout(width: number, height: number): void {
        this.width = width;
        this.fieldBox = this.sceneBoxFactory.create(width, height);
        this.movingPoints = this.fieldData.getMonthVolumes().map(() => new MovingPoint(0, 0));
        this.follow(1);
    }

    public advance(seconds: number): void {
        this.sceneCycle.advance(seconds);

        if (this.sceneCycle.getRound() !== this.round) {
            this.round = this.sceneCycle.getRound();
            this.follow(1);

            return;
        }

        this.follow(1 - Math.exp(-this.SMOOTHING * seconds));
    }

    public settle(): void {
        this.sceneCycle.finish();
        this.follow(1);
    }

    public draw(canvasRenderingContext2D: CanvasRenderingContext2D, fieldPalette: FieldPalette): void {
        const mergeFrame: MergeFrame | undefined = this.currentFrame();

        if (mergeFrame === undefined) {
            return;
        }

        const monthVolumes: readonly MonthVolume[] = this.fieldData.getMonthVolumes();
        const slotWidth: number = this.fieldBox.getWidth() / Math.max(1, monthVolumes.length);
        const barWidth: number = Math.max(1, slotWidth - this.GAP);
        const baseline: number = this.fieldBox.getTop() + this.fieldBox.getHeight();

        canvasRenderingContext2D.strokeStyle = fieldPalette.lineAt(1);
        canvasRenderingContext2D.lineWidth = 1;
        canvasRenderingContext2D.beginPath();
        canvasRenderingContext2D.moveTo(this.fieldBox.getLeft(), baseline + 0.5);
        canvasRenderingContext2D.lineTo(this.fieldBox.getLeft() + this.fieldBox.getWidth(), baseline + 0.5);
        canvasRenderingContext2D.stroke();

        const pointedSlot: number | null = this.pointed === null ? null : this.slotAt(this.pointed);

        mergeFrame.getOrder().forEach((item: number, slot: number) => {
            const barHeight: number = this.heightOf(monthVolumes[item].getDownloads());
            const merging: boolean =
                mergeFrame.getMergeFrameKind() === "merge" && slot >= mergeFrame.getFrom() && slot < mergeFrame.getTo();

            if (slot === pointedSlot) {
                canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.9);
            } else if (merging) {
                canvasRenderingContext2D.fillStyle = fieldPalette.accentAt(0.85);
            } else if (mergeFrame.getMergeFrameKind() === "sorted") {
                canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.55);
            } else {
                canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.32);
            }

            canvasRenderingContext2D.fillRect(
                this.movingPoints[item].getX(),
                baseline - barHeight,
                barWidth,
                barHeight
            );
        });

        if (mergeFrame.getMergeFrameKind() === "merge") {
            this.drawPassLabels(canvasRenderingContext2D, fieldPalette, mergeFrame, slotWidth, barWidth);
        }
    }

    public point(fieldPoint: FieldPoint | null): void {
        this.pointed = fieldPoint;
    }

    public caption(): string {
        return "Merge sort of my monthly downloads, smallest to largest.";
    }

    public ticker(): string {
        const mergeFrame: MergeFrame | undefined = this.currentFrame();
        const monthVolumes: readonly MonthVolume[] = this.fieldData.getMonthVolumes();

        if (mergeFrame === undefined || monthVolumes.length === 0) {
            return "";
        }

        if (mergeFrame.getMergeFrameKind() === "merge") {
            return `Pass ${Math.log2(mergeFrame.getWidth()) + 1} of ${this.passes}: runs of ${mergeFrame.getWidth()} ${mergeFrame.getWidth() === 1 ? "month" : "months"}`;
        }

        if (mergeFrame.getMergeFrameKind() === "sorted") {
            const sorted: number[] = monthVolumes
                .map((monthVolume: MonthVolume) => monthVolume.getDownloads())
                .sort((first: number, second: number) => first - second);

            return `In order: ${this.numberFormatter.exact(sorted[0])} to ${this.numberFormatter.exact(sorted[sorted.length - 1])} downloads a month`;
        }

        return `${monthVolumes.length} months of downloads, in the order of the calendar`;
    }

    public labelAt(fieldPoint: FieldPoint): string | null {
        const mergeFrame: MergeFrame | undefined = this.currentFrame();

        if (mergeFrame === undefined) {
            return null;
        }

        const slot: number | null = this.slotAt(fieldPoint);

        if (slot === null) {
            return null;
        }

        const monthVolume: MonthVolume = this.fieldData.getMonthVolumes()[mergeFrame.getOrder()[slot]];

        return `${monthVolume.getLabel()}: ${this.numberFormatter.exact(monthVolume.getDownloads())} downloads`;
    }

    private slotAt(fieldPoint: FieldPoint): number | null {
        const mergeFrame: MergeFrame | undefined = this.currentFrame();
        const slotWidth: number = this.fieldBox.getWidth() / Math.max(1, this.movingPoints.length);

        if (mergeFrame === undefined) {
            return null;
        }

        return this.markFinder.holding(
            mergeFrame
                .getOrder()
                .map(
                    (item: number) =>
                        new FieldBox(
                            this.movingPoints[item]?.getX() ?? 0,
                            this.fieldBox.getTop(),
                            slotWidth,
                            this.fieldBox.getHeight()
                        )
                ),
            fieldPoint
        );
    }

    private drawPassLabels(
        canvasRenderingContext2D: CanvasRenderingContext2D,
        fieldPalette: FieldPalette,
        mergeFrame: MergeFrame,
        slotWidth: number,
        barWidth: number
    ): void {
        const share: number = this.sceneCycle.frameShare();
        const alpha: number = Math.min(1, share / this.LABEL_FADE, (1 - share) / this.LABEL_FADE);
        const order: readonly number[] = mergeFrame.getOrder();
        const previous: MergeFrame | undefined = this.mergeFrames[this.sceneCycle.frameIndex() - 1];
        const monthVolumes: readonly MonthVolume[] = this.fieldData.getMonthVolumes();
        const baseline: number = this.fieldBox.getTop() + this.fieldBox.getHeight();
        const slots: number[] = Array.from(
            { length: mergeFrame.getTo() - mergeFrame.getFrom() },
            (_: unknown, offset: number) => mergeFrame.getFrom() + offset
        );
        const moved: number[] = slots.filter((slot: number) => previous?.getOrder()[slot] !== order[slot]);
        const placed: FieldBox[] = [];

        if (alpha <= 0) {
            return;
        }

        canvasRenderingContext2D.font = this.LABEL_FONT;
        canvasRenderingContext2D.textBaseline = "bottom";
        canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.8 * alpha);
        [...moved, ...slots.filter((slot: number) => !moved.includes(slot))].forEach((slot: number) => {
            const item: number = order[slot];
            const words: string = this.numberFormatter.compact(monthVolumes[item].getDownloads());
            const wordsWidth: number = canvasRenderingContext2D.measureText(words).width;
            const left: number = this.within(
                this.fieldBox.getLeft() + slot * slotWidth + barWidth / 2 - wordsWidth / 2,
                this.width - wordsWidth
            );
            const firstSlot: number = Math.max(0, Math.floor((left - this.fieldBox.getLeft()) / slotWidth));
            const lastSlot: number = Math.min(
                order.length - 1,
                Math.floor((left + wordsWidth - this.fieldBox.getLeft()) / slotWidth)
            );
            const tallest: number = Math.max(
                0,
                ...order
                    .slice(firstSlot, lastSlot + 1)
                    .map((other: number) => this.heightOf(monthVolumes[other].getDownloads()))
            );
            const fieldBox: FieldBox = new FieldBox(
                left,
                Math.max(0, baseline - tallest - this.LABEL_GAP - this.LABEL_HEIGHT),
                wordsWidth,
                this.LABEL_HEIGHT
            );

            if (placed.some((other: FieldBox) => this.overlaps(other, fieldBox))) {
                return;
            }

            placed.push(fieldBox);
            canvasRenderingContext2D.fillText(
                words,
                this.within(this.movingPoints[item].getX() + barWidth / 2 - wordsWidth / 2, this.width - wordsWidth),
                fieldBox.getTop() + this.LABEL_HEIGHT
            );
        });
    }

    private overlaps(first: FieldBox, second: FieldBox): boolean {
        return (
            first.getLeft() < second.getLeft() + second.getWidth() + this.LABEL_SPACE &&
            second.getLeft() < first.getLeft() + first.getWidth() + this.LABEL_SPACE &&
            first.getTop() < second.getTop() + second.getHeight() + this.LABEL_SPACE &&
            second.getTop() < first.getTop() + first.getHeight() + this.LABEL_SPACE
        );
    }

    private within(start: number, largest: number): number {
        return Math.max(0, Math.min(start, largest));
    }

    private heightOf(downloads: number): number {
        return Math.max(1.5, (this.fieldBox.getHeight() * downloads) / this.largestDownloads);
    }

    private currentFrame(): MergeFrame | undefined {
        return this.mergeFrames[this.sceneCycle.frameIndex()];
    }

    private follow(share: number): void {
        const mergeFrame: MergeFrame | undefined = this.currentFrame();
        const slotWidth: number = this.fieldBox.getWidth() / Math.max(1, this.movingPoints.length);

        mergeFrame
            ?.getOrder()
            .forEach((item: number, slot: number) =>
                this.movingPoints[item]?.approach(
                    new FieldPoint(this.fieldBox.getLeft() + slot * slotWidth, this.fieldBox.getTop()),
                    share
                )
            );
    }

    private expanded(mergeFrames: readonly MergeFrame[]): MergeFrame[] {
        return mergeFrames.flatMap((mergeFrame: MergeFrame) => {
            const repeats: number =
                mergeFrame.getMergeFrameKind() === "start"
                    ? this.START_FRAMES
                    : mergeFrame.getMergeFrameKind() === "sorted"
                      ? this.SORTED_FRAMES
                      : mergeFrame.getMergeFrameKind() === "return"
                        ? this.RETURN_FRAMES
                        : 1;

            return Array.from({ length: repeats }, () => mergeFrame);
        });
    }
}
