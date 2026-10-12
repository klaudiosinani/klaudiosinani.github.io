import type { FieldData } from "@app/feature/field/FieldData";
import type { FieldPalette } from "../../FieldPalette";
import type { FieldScene } from "../../FieldScene";
import type { HeapFrame } from "./HeapFrame";
import type { HeapLayout } from "./HeapLayout";
import type { HeapPlanner } from "./HeapPlanner";
import type { MonthVolume } from "@app/feature/field/MonthVolume";
import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import type { SceneBoxFactory } from "../../SceneBoxFactory";
import { FIELD_SCALE } from "../../FieldScale";
import { FieldBox } from "../../FieldBox";
import { FieldPoint } from "../../FieldPoint";
import { MarkFinder } from "../../MarkFinder";
import { MovingPoint } from "../../MovingPoint";
import { SceneCycle } from "../../SceneCycle";

export class BinaryHeapScene implements FieldScene {
    private readonly SECONDS_PER_FRAME: number = 0.5;
    private readonly HOLD_SECONDS: number = 6;
    private readonly FADE_SECONDS: number = 1.2;
    private readonly SMOOTHING: number = 5;
    private readonly ITEMS: number = 31;
    private readonly NARROW_ITEMS: number = 15;
    private readonly TREE_SHARE: number = 0.7;
    private readonly STRIP_GAP: number = 0.08;
    private readonly SMALLEST_RADIUS: number = 2;
    private readonly RADIUS_RANGE: number = 4;
    private readonly RING_RADIUS: number = 9;
    private readonly BAR_SHARE: number = 0.62;
    private readonly REACH: number = 12;

    private readonly fieldData: FieldData;
    private readonly heapPlanner: HeapPlanner;
    private readonly heapLayout: HeapLayout;
    private readonly sceneBoxFactory: SceneBoxFactory;
    private readonly numberFormatter: NumberFormatter;
    private readonly markFinder: MarkFinder = new MarkFinder();
    private monthVolumes: MonthVolume[] = [];
    private heapFrames: HeapFrame[] = [];
    private sceneCycle: SceneCycle = new SceneCycle(1, 1, 1, 1);
    private treeBox: FieldBox = new FieldBox(0, 0, 1, 1);
    private arrayBox: FieldBox = new FieldBox(0, 0, 1, 1);
    private treePoints: MovingPoint[] = [];
    private arrayPoints: MovingPoint[] = [];
    private largestDownloads: number = 1;
    private levels: number = 1;
    private round: number = 0;
    private itemCount: number = 0;
    private settledIndex: number | null = null;
    private pointed: FieldPoint | null = null;

    public constructor(
        fieldData: FieldData,
        heapPlanner: HeapPlanner,
        heapLayout: HeapLayout,
        sceneBoxFactory: SceneBoxFactory,
        numberFormatter: NumberFormatter
    ) {
        this.fieldData = fieldData;
        this.heapPlanner = heapPlanner;
        this.heapLayout = heapLayout;
        this.sceneBoxFactory = sceneBoxFactory;
        this.numberFormatter = numberFormatter;
    }

    public layout(width: number, height: number): void {
        const fieldBox: FieldBox = this.sceneBoxFactory.create(width, height);
        const count: number = FIELD_SCALE.isNarrow(width) ? this.NARROW_ITEMS : this.ITEMS;

        if (this.heapFrames.length === 0 || count !== this.itemCount) {
            this.plan(count);
        }

        this.treeBox = new FieldBox(
            fieldBox.getLeft(),
            fieldBox.getTop(),
            fieldBox.getWidth(),
            fieldBox.getHeight() * this.TREE_SHARE
        );
        this.arrayBox = new FieldBox(
            fieldBox.getLeft(),
            fieldBox.getTop() + fieldBox.getHeight() * (this.TREE_SHARE + this.STRIP_GAP),
            fieldBox.getWidth(),
            fieldBox.getHeight() * (1 - this.TREE_SHARE - this.STRIP_GAP)
        );
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
        const firstTake: number = this.heapFrames.findIndex(
            (heapFrame: HeapFrame) => heapFrame.getHeapFrameKind() === "take"
        );

        this.settledIndex = Math.max(0, firstTake - 1);
        this.follow(1);
    }

    public draw(canvasRenderingContext2D: CanvasRenderingContext2D, fieldPalette: FieldPalette): void {
        const heapFrame: HeapFrame | undefined = this.currentFrame();

        if (heapFrame === undefined) {
            return;
        }

        const alpha: number = this.settledIndex === null ? this.sceneCycle.alpha() : 1;
        const order: readonly number[] = heapFrame.getOrder();
        const focus: readonly number[] =
            this.settledIndex === null && this.sceneCycle.isPlaying() ? heapFrame.getFocus() : [];

        const pointedItem: number | null = this.pointed === null ? null : this.itemAt(this.pointed);

        canvasRenderingContext2D.lineWidth = 1;
        canvasRenderingContext2D.strokeStyle = fieldPalette.inkAt(0.28 * alpha);
        canvasRenderingContext2D.beginPath();

        for (let slot: number = 1; slot < heapFrame.getHeapSize(); slot += 1) {
            const parentPoint: MovingPoint = this.treePoints[order[Math.floor((slot - 1) / 2)]];
            const childPoint: MovingPoint = this.treePoints[order[slot]];

            canvasRenderingContext2D.moveTo(parentPoint.getX(), parentPoint.getY());
            canvasRenderingContext2D.lineTo(childPoint.getX(), childPoint.getY());
        }

        canvasRenderingContext2D.stroke();

        for (let slot: number = 0; slot < heapFrame.getHeapSize(); slot += 1) {
            const item: number = order[slot];
            const movingPoint: MovingPoint = this.treePoints[item];
            const focused: boolean = focus.includes(slot);

            canvasRenderingContext2D.fillStyle = focused
                ? fieldPalette.accentAt(alpha)
                : fieldPalette.inkAt(0.5 * alpha);
            canvasRenderingContext2D.beginPath();
            canvasRenderingContext2D.arc(movingPoint.getX(), movingPoint.getY(), this.radiusOf(item), 0, Math.PI * 2);
            canvasRenderingContext2D.fill();

            if (item === pointedItem) {
                canvasRenderingContext2D.strokeStyle = fieldPalette.inkAt(0.7 * alpha);
                canvasRenderingContext2D.beginPath();
                canvasRenderingContext2D.arc(movingPoint.getX(), movingPoint.getY(), this.RING_RADIUS, 0, Math.PI * 2);
                canvasRenderingContext2D.stroke();
            }

            if (focused) {
                canvasRenderingContext2D.strokeStyle = fieldPalette.accentAt(0.6 * alpha);
                canvasRenderingContext2D.beginPath();
                canvasRenderingContext2D.arc(movingPoint.getX(), movingPoint.getY(), this.RING_RADIUS, 0, Math.PI * 2);
                canvasRenderingContext2D.stroke();
            }
        }

        const barWidth: number = Math.max(
            1.5,
            (this.arrayBox.getWidth() / Math.max(1, this.monthVolumes.length)) * this.BAR_SHARE
        );
        const baseline: number = this.arrayBox.getTop() + this.arrayBox.getHeight();

        canvasRenderingContext2D.strokeStyle = fieldPalette.lineAt(alpha);
        canvasRenderingContext2D.beginPath();
        canvasRenderingContext2D.moveTo(this.arrayBox.getLeft(), baseline + 0.5);
        canvasRenderingContext2D.lineTo(this.arrayBox.getLeft() + this.arrayBox.getWidth(), baseline + 0.5);
        canvasRenderingContext2D.stroke();

        order.forEach((item: number, slot: number) => {
            const barHeight: number = Math.max(
                1.5,
                (this.arrayBox.getHeight() * this.monthVolumes[item].getDownloads()) / this.largestDownloads
            );

            if (item === pointedItem) {
                canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.9 * alpha);
            } else if (slot >= heapFrame.getHeapSize()) {
                canvasRenderingContext2D.fillStyle = fieldPalette.accentAt(0.75 * alpha);
            } else if (focus.includes(slot)) {
                canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.85 * alpha);
            } else {
                canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.32 * alpha);
            }

            canvasRenderingContext2D.fillRect(
                this.arrayPoints[item].getX() - barWidth / 2,
                baseline - barHeight,
                barWidth,
                barHeight
            );
        });
    }

    public caption(): string {
        return "A max heap of my monthly downloads, sorted by heapsort.";
    }

    public ticker(): string {
        const heapFrame: HeapFrame | undefined = this.currentFrame();

        if (heapFrame === undefined) {
            return "";
        }

        if (this.settledIndex !== null) {
            return `${this.monthVolumes.length} months in a max heap, keyed by their downloads`;
        }

        if (!this.sceneCycle.isPlaying()) {
            return `${this.monthVolumes.length} months in order of their downloads`;
        }

        const monthVolume: MonthVolume = this.monthVolumes[heapFrame.getItem()];
        const label: string = monthVolume.getLabel();
        const downloads: string = this.numberFormatter.exact(monthVolume.getDownloads());

        switch (heapFrame.getHeapFrameKind()) {
            case "insert":
                return `Insert ${label}: ${downloads} downloads`;
            case "rise":
                return `${label} rises above its parent`;
            case "sink":
                return `${label} sinks below a larger child`;
            default:
                return `Take out ${label}: ${downloads} downloads`;
        }
    }

    public labelAt(fieldPoint: FieldPoint): string | null {
        const item: number | null = this.itemAt(fieldPoint);

        return item === null ? null : this.wordsOf(this.monthVolumes[item]);
    }

    public point(fieldPoint: FieldPoint | null): void {
        this.pointed = fieldPoint;
    }

    private itemAt(fieldPoint: FieldPoint): number | null {
        const heapFrame: HeapFrame | undefined = this.currentFrame();
        const alpha: number = this.settledIndex === null ? this.sceneCycle.alpha() : 1;

        if (heapFrame === undefined || alpha === 0) {
            return null;
        }

        const order: readonly number[] = heapFrame.getOrder();
        const heapItems: readonly number[] = order.slice(0, heapFrame.getHeapSize());
        const node: number | null = this.markFinder.nearest(
            heapItems.map((item: number) => new FieldPoint(this.treePoints[item].getX(), this.treePoints[item].getY())),
            fieldPoint,
            this.REACH
        );

        if (node !== null) {
            return heapItems[node];
        }

        const slotWidth: number = this.arrayBox.getWidth() / Math.max(1, this.monthVolumes.length);
        const bar: number | null = this.markFinder.holding(
            order.map(
                (item: number) =>
                    new FieldBox(
                        this.arrayPoints[item].getX() - slotWidth / 2,
                        this.arrayBox.getTop(),
                        slotWidth,
                        this.arrayBox.getHeight()
                    )
            ),
            fieldPoint
        );

        return bar === null ? null : order[bar];
    }

    private wordsOf(monthVolume: MonthVolume): string {
        return `${monthVolume.getLabel()}: ${this.numberFormatter.exact(monthVolume.getDownloads())} downloads`;
    }

    private plan(count: number): void {
        this.itemCount = count;
        this.monthVolumes = this.fieldData.getMonthVolumes().slice(-count);
        this.largestDownloads = Math.max(
            1,
            ...this.monthVolumes.map((monthVolume: MonthVolume) => monthVolume.getDownloads())
        );
        this.levels = Math.floor(Math.log2(Math.max(1, this.monthVolumes.length))) + 1;
        this.heapFrames = this.heapPlanner.plan(
            this.monthVolumes.map((monthVolume: MonthVolume) => monthVolume.getDownloads())
        );
        this.sceneCycle = new SceneCycle(
            Math.max(1, this.heapFrames.length),
            this.SECONDS_PER_FRAME,
            this.HOLD_SECONDS,
            this.FADE_SECONDS
        );
        this.treePoints = this.monthVolumes.map(() => new MovingPoint(0, 0));
        this.arrayPoints = this.monthVolumes.map(() => new MovingPoint(0, 0));
    }

    private currentFrame(): HeapFrame | undefined {
        return this.heapFrames[this.settledIndex ?? this.sceneCycle.frameIndex()];
    }

    private follow(share: number): void {
        const heapFrame: HeapFrame | undefined = this.currentFrame();

        if (heapFrame === undefined) {
            return;
        }

        heapFrame.getOrder().forEach((item: number, slot: number) => {
            const arrayPoint: FieldPoint = this.heapLayout.arrayPoint(slot, this.monthVolumes.length, this.arrayBox);

            this.arrayPoints[item].approach(arrayPoint, share);

            if (slot < heapFrame.getHeapSize()) {
                this.treePoints[item].approach(this.heapLayout.treePoint(slot, this.treeBox, this.levels), share);
            }
        });
    }

    private radiusOf(item: number): number {
        return (
            this.SMALLEST_RADIUS +
            this.RADIUS_RANGE * Math.sqrt(this.monthVolumes[item].getDownloads() / this.largestDownloads)
        );
    }
}
