import type { FieldData } from "@app/feature/field/FieldData";
import type { FieldPalette } from "../../FieldPalette";
import type { FieldScene } from "../../FieldScene";
import type { HashFrame } from "./HashFrame";
import type { HashTablePlanner } from "./HashTablePlanner";
import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import type { SceneBoxFactory } from "../../SceneBoxFactory";
import { FIELD_SCALE } from "../../FieldScale";
import { FieldBox } from "../../FieldBox";
import { FieldPoint } from "../../FieldPoint";
import { MarkFinder } from "../../MarkFinder";
import { MovingPoint } from "../../MovingPoint";
import { SceneCycle } from "../../SceneCycle";

export class HashTableScene implements FieldScene {
    private readonly SECONDS_PER_FRAME: number = 0.8;
    private readonly GROW_REPEATS: number = 3;
    private readonly HOLD_SECONDS: number = 6;
    private readonly FADE_SECONDS: number = 1.2;
    private readonly GLOW_SECONDS: number = 0.9;
    private readonly SMOOTHING: number = 4;
    private readonly ENTRIES: number = 12;
    private readonly NARROW_ENTRIES: number = 6;
    private readonly LOAD_LIMIT: number = 0.75;
    private readonly SOURCE_SHARE: number = 0.3;
    private readonly ENTER_SHARE: number = 0.3;
    private readonly LAND_SHARE: number = 0.8;
    private readonly INDEX_WIDTH: number = 40;
    private readonly NODE_SHARE: number = 0.56;
    private readonly NODE_RATIO: number = 1.8;
    private readonly LINK: number = 7;
    private readonly HASH_WIDTH: number = 46;
    private readonly HASH_HEIGHT: number = 24;
    private readonly TEXT_INSET: number = 6;
    private readonly SMALLEST_REACH: number = 8;
    private readonly FONT: string = '500 10px "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif';

    private readonly fieldData: FieldData;
    private readonly hashTablePlanner: HashTablePlanner;
    private readonly sceneBoxFactory: SceneBoxFactory;
    private readonly numberFormatter: NumberFormatter;
    private readonly markFinder: MarkFinder = new MarkFinder();
    private hashFrames: HashFrame[] = [];
    private sceneCycle: SceneCycle = new SceneCycle(1, 1, 1, 1);
    private movingPoints: MovingPoint[] = [];
    private fieldBox: FieldBox = new FieldBox(0, 0, 1, 1);
    private entryCount: number = 0;
    private groupSize: number = 1;
    private rowHeight: number = 1;
    private shownRows: number = 1;
    private round: number = 0;
    private landedFrame: number = -1;
    private landedRow: number | null = null;
    private sinceLanding: number = 0;
    private settled: boolean = false;
    private pointed: FieldPoint | null = null;

    public constructor(
        fieldData: FieldData,
        hashTablePlanner: HashTablePlanner,
        sceneBoxFactory: SceneBoxFactory,
        numberFormatter: NumberFormatter
    ) {
        this.fieldData = fieldData;
        this.hashTablePlanner = hashTablePlanner;
        this.sceneBoxFactory = sceneBoxFactory;
        this.numberFormatter = numberFormatter;
    }

    public layout(width: number, height: number): void {
        const count: number = FIELD_SCALE.isNarrow(width) ? this.NARROW_ENTRIES : this.ENTRIES;

        if (this.hashFrames.length === 0 || count !== this.entryCount) {
            this.plan(count);
        }

        this.fieldBox = this.sceneBoxFactory.create(width, height);
        this.rowHeight = this.fieldBox.getHeight() / (this.lastFrame().getBucketCount() + 1);
        this.follow(1);
    }

    public advance(seconds: number): void {
        this.sceneCycle.advance(seconds);

        if (this.sceneCycle.getRound() !== this.round) {
            this.round = this.sceneCycle.getRound();
            this.landedFrame = -1;
            this.landedRow = null;
            this.shownRows = this.hashFrames[0]?.getBucketCount() ?? 1;
            this.follow(1);

            return;
        }

        this.sinceLanding += seconds;
        this.land();
        this.follow(1 - Math.exp(-this.SMOOTHING * seconds));
    }

    public settle(): void {
        this.settled = true;
        this.landedRow = null;
        this.follow(1);
    }

    public draw(canvasRenderingContext2D: CanvasRenderingContext2D, fieldPalette: FieldPalette): void {
        const hashFrame: HashFrame | undefined = this.currentFrame();

        if (hashFrame === undefined) {
            return;
        }

        const alpha: number = this.settled ? 1 : this.sceneCycle.alpha();
        const flying: number | null = this.flyingKey();
        const glow: number = Math.max(0, 1 - this.sinceLanding / this.GLOW_SECONDS);

        canvasRenderingContext2D.font = this.FONT;
        canvasRenderingContext2D.lineWidth = 1;
        this.drawRows(canvasRenderingContext2D, fieldPalette, hashFrame, alpha, flying, glow);
        this.drawChains(canvasRenderingContext2D, fieldPalette, hashFrame, alpha, flying);
        this.drawHash(canvasRenderingContext2D, fieldPalette, hashFrame, alpha, flying);
    }

    public caption(): string {
        return "A hash table of the repositories that depend on my work.";
    }

    public ticker(): string {
        const hashFrame: HashFrame | undefined = this.currentFrame();
        const total: number = this.fieldData.getDependentRepositories();

        if (hashFrame === undefined) {
            return "";
        }

        if (this.settled || !this.sceneCycle.isPlaying()) {
            return `${this.numberFormatter.exact(total)} dependent repositories in ${hashFrame.getBucketCount()} buckets`;
        }

        if (hashFrame.getHashFrameKind() === "grow") {
            return `The load passes ${this.LOAD_LIMIT}, so the table grows to ${hashFrame.getBucketCount()} buckets`;
        }

        return `${this.numberFormatter.exact(Math.min(hashFrame.getEntries() * this.groupSize, total))} of ${this.numberFormatter.exact(total)} dependent repositories, load ${this.loadOf(hashFrame)}`;
    }

    public labelAt(fieldPoint: FieldPoint): string | null {
        const key: number | null = this.keyAt(fieldPoint);

        return key === null ? null : `${this.numberFormatter.exact(this.countOf(key))} dependent repositories`;
    }

    public point(fieldPoint: FieldPoint | null): void {
        this.pointed = fieldPoint;
    }

    private plan(count: number): void {
        const total: number = this.fieldData.getDependentRepositories();
        const share: number = Math.max(1, total / count);
        const step: number = Math.max(1, 10 ** (Math.floor(Math.log10(share)) - 1));

        this.entryCount = count;
        this.groupSize = Math.ceil(share / step) * step;
        this.hashFrames = this.hashTablePlanner
            .plan(Math.max(1, Math.ceil(total / this.groupSize)))
            .flatMap((hashFrame: HashFrame) =>
                Array.from({ length: hashFrame.getHashFrameKind() === "grow" ? this.GROW_REPEATS : 1 }, () => hashFrame)
            );
        this.sceneCycle = new SceneCycle(
            this.hashFrames.length,
            this.SECONDS_PER_FRAME,
            this.HOLD_SECONDS,
            this.FADE_SECONDS
        );
        this.movingPoints = Array.from({ length: this.lastFrame().getEntries() }, () => new MovingPoint(0, 0));
        this.shownRows = this.hashFrames[0]?.getBucketCount() ?? 1;
    }

    private currentFrame(): HashFrame | undefined {
        return this.settled ? this.lastFrame() : this.hashFrames[this.sceneCycle.frameIndex()];
    }

    private lastFrame(): HashFrame {
        return this.hashFrames[this.hashFrames.length - 1];
    }

    private follow(share: number): void {
        const hashFrame: HashFrame | undefined = this.currentFrame();
        const flying: number | null = this.flyingKey();

        if (hashFrame === undefined) {
            return;
        }

        this.shownRows += (hashFrame.getBucketCount() - this.shownRows) * share;

        for (let key: number = 0; key < hashFrame.getEntries(); key += 1) {
            if (key === flying) {
                this.movingPoints[key].place(this.targetOf(hashFrame, key));
            } else {
                this.movingPoints[key].approach(this.targetOf(hashFrame, key), share);
            }
        }
    }

    private land(): void {
        const hashFrame: HashFrame | undefined = this.currentFrame();
        const frameIndex: number = this.sceneCycle.frameIndex();

        if (
            hashFrame === undefined ||
            hashFrame.getHashFrameKind() !== "insert" ||
            !this.sceneCycle.isPlaying() ||
            this.sceneCycle.frameShare() < this.LAND_SHARE ||
            this.landedFrame === frameIndex
        ) {
            return;
        }

        this.landedFrame = frameIndex;
        this.landedRow = hashFrame.getBuckets()[hashFrame.getEntries() - 1];
        this.sinceLanding = 0;
    }

    private flyingKey(): number | null {
        const hashFrame: HashFrame | undefined = this.currentFrame();

        if (
            this.settled ||
            hashFrame === undefined ||
            hashFrame.getHashFrameKind() !== "insert" ||
            !this.sceneCycle.isPlaying() ||
            this.sceneCycle.frameShare() >= this.LAND_SHARE
        ) {
            return null;
        }

        return hashFrame.getEntries() - 1;
    }

    private flightPoint(hashFrame: HashFrame, key: number): FieldPoint {
        const share: number = this.sceneCycle.frameShare();
        const hashCenter: FieldPoint = this.hashCenter();
        const target: FieldPoint = this.targetOf(hashFrame, key);

        if (share < this.ENTER_SHARE) {
            const entering: number = this.eased(share / this.ENTER_SHARE);

            return new FieldPoint(
                this.fieldBox.getLeft() + (hashCenter.getX() - this.fieldBox.getLeft()) * entering,
                hashCenter.getY()
            );
        }

        const progress: number = this.eased((share - this.ENTER_SHARE) / (this.LAND_SHARE - this.ENTER_SHARE));
        const controlX: number = hashCenter.getX() + (target.getX() - hashCenter.getX()) * 0.5;
        const rest: number = 1 - progress;

        return new FieldPoint(
            rest * rest * hashCenter.getX() + 2 * rest * progress * controlX + progress * progress * target.getX(),
            rest * rest * hashCenter.getY() + (2 * rest * progress + progress * progress) * target.getY()
        );
    }

    private eased(progress: number): number {
        const clamped: number = Math.max(0, Math.min(1, progress));

        return clamped * clamped * (3 - 2 * clamped);
    }

    private drawRows(
        canvasRenderingContext2D: CanvasRenderingContext2D,
        fieldPalette: FieldPalette,
        hashFrame: HashFrame,
        alpha: number,
        flying: number | null,
        glow: number
    ): void {
        const left: number = this.tableLeft();
        const width: number = this.fieldBox.getLeft() + this.fieldBox.getWidth() - left;
        const top: number = this.fieldBox.getTop();
        const rows: number = Math.ceil(this.shownRows - 0.01);
        const bottom: number = top + this.rowHeight * (this.shownRows + 1);
        const aimedRow: number | null = flying === null ? null : hashFrame.getBuckets()[flying];
        const indexRight: number = left + this.INDEX_WIDTH - this.TEXT_INSET;

        canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.06 * alpha);
        canvasRenderingContext2D.fillRect(left, top, width, this.rowHeight);
        canvasRenderingContext2D.textBaseline = "middle";

        for (let row: number = 0; row < rows; row += 1) {
            const rowTop: number = top + this.rowHeight * (row + 1);
            const presence: number = Math.max(0, Math.min(1, this.shownRows - row)) * alpha;

            if (row % 2 === 1) {
                canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.035 * presence);
                canvasRenderingContext2D.fillRect(left, rowTop, width, this.rowHeight);
            }

            if (row === aimedRow) {
                canvasRenderingContext2D.fillStyle = fieldPalette.accentAt(0.08 * presence);
                canvasRenderingContext2D.fillRect(left, rowTop, width, this.rowHeight);
            }

            if (row === this.landedRow && glow > 0) {
                canvasRenderingContext2D.fillStyle = fieldPalette.accentAt(0.2 * glow * presence);
                canvasRenderingContext2D.fillRect(left, rowTop, width, this.rowHeight);
            }

            canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.7 * presence);
            canvasRenderingContext2D.textAlign = "right";
            canvasRenderingContext2D.fillText(String(row), indexRight, rowTop + this.rowHeight / 2);
        }

        canvasRenderingContext2D.strokeStyle = fieldPalette.lineAt(alpha);
        canvasRenderingContext2D.beginPath();

        for (let row: number = 1; row <= rows; row += 1) {
            const ruleY: number = Math.round(top + this.rowHeight * row) + 0.5;

            canvasRenderingContext2D.moveTo(left, ruleY);
            canvasRenderingContext2D.lineTo(left + width, ruleY);
        }

        canvasRenderingContext2D.moveTo(Math.round(left + this.INDEX_WIDTH) + 0.5, top);
        canvasRenderingContext2D.lineTo(Math.round(left + this.INDEX_WIDTH) + 0.5, bottom);
        canvasRenderingContext2D.stroke();
        canvasRenderingContext2D.strokeRect(Math.round(left) + 0.5, Math.round(top) + 0.5, width - 1, bottom - top);

        canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.7 * alpha);
        canvasRenderingContext2D.textAlign = "right";
        canvasRenderingContext2D.fillText("index", indexRight, top + this.rowHeight / 2);
        canvasRenderingContext2D.textAlign = "left";
        canvasRenderingContext2D.fillText(
            "entries",
            left + this.INDEX_WIDTH + this.TEXT_INSET,
            top + this.rowHeight / 2
        );
    }

    private drawChains(
        canvasRenderingContext2D: CanvasRenderingContext2D,
        fieldPalette: FieldPalette,
        hashFrame: HashFrame,
        alpha: number,
        flying: number | null
    ): void {
        const nodeHeight: number = this.nodeHeight();
        const nodeWidth: number = nodeHeight * this.NODE_RATIO;
        const pointedKey: number | null = this.pointed === null ? null : this.keyAt(this.pointed);

        canvasRenderingContext2D.strokeStyle = fieldPalette.inkAt(0.35 * alpha);
        canvasRenderingContext2D.beginPath();

        for (let key: number = 0; key < hashFrame.getEntries(); key += 1) {
            if (key !== flying) {
                const movingPoint: MovingPoint = this.movingPoints[key];

                canvasRenderingContext2D.moveTo(movingPoint.getX() - nodeWidth / 2 - this.LINK, movingPoint.getY());
                canvasRenderingContext2D.lineTo(movingPoint.getX() - nodeWidth / 2, movingPoint.getY());
            }
        }

        canvasRenderingContext2D.stroke();

        for (let key: number = 0; key < hashFrame.getEntries(); key += 1) {
            if (key !== flying) {
                this.drawNode(
                    canvasRenderingContext2D,
                    new FieldPoint(this.movingPoints[key].getX(), this.movingPoints[key].getY()),
                    fieldPalette.inkAt(0.14 * alpha),
                    key === pointedKey ? fieldPalette.inkAt(0.95 * alpha) : fieldPalette.inkAt(0.5 * alpha)
                );
            }
        }

        if (flying === null) {
            return;
        }

        const flightPoint: FieldPoint = this.flightPoint(hashFrame, flying);

        this.drawNode(
            canvasRenderingContext2D,
            flightPoint,
            fieldPalette.accentAt(0.35 * alpha),
            fieldPalette.accentAt(alpha)
        );
        canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.8 * alpha);
        canvasRenderingContext2D.textAlign = "center";
        canvasRenderingContext2D.textBaseline = "bottom";
        canvasRenderingContext2D.fillText(
            this.numberFormatter.compact(this.countOf(flying)),
            flightPoint.getX(),
            flightPoint.getY() - nodeHeight / 2 - 2
        );
    }

    private drawNode(
        canvasRenderingContext2D: CanvasRenderingContext2D,
        fieldPoint: FieldPoint,
        fill: string,
        edge: string
    ): void {
        const nodeHeight: number = this.nodeHeight();
        const nodeWidth: number = nodeHeight * this.NODE_RATIO;

        canvasRenderingContext2D.beginPath();
        canvasRenderingContext2D.roundRect(
            fieldPoint.getX() - nodeWidth / 2,
            fieldPoint.getY() - nodeHeight / 2,
            nodeWidth,
            nodeHeight,
            nodeHeight / 2
        );
        canvasRenderingContext2D.fillStyle = fill;
        canvasRenderingContext2D.fill();
        canvasRenderingContext2D.strokeStyle = edge;
        canvasRenderingContext2D.stroke();
    }

    private drawHash(
        canvasRenderingContext2D: CanvasRenderingContext2D,
        fieldPalette: FieldPalette,
        hashFrame: HashFrame,
        alpha: number,
        flying: number | null
    ): void {
        const hashCenter: FieldPoint = this.hashCenter();
        const guideY: number = Math.round(hashCenter.getY()) + 0.5;
        const hashing: boolean = flying !== null && this.sceneCycle.frameShare() < this.ENTER_SHARE * 1.5;

        canvasRenderingContext2D.strokeStyle = fieldPalette.inkAt(0.14 * alpha);
        canvasRenderingContext2D.beginPath();
        canvasRenderingContext2D.moveTo(this.fieldBox.getLeft(), guideY);
        canvasRenderingContext2D.lineTo(hashCenter.getX() - this.HASH_WIDTH / 2, guideY);
        canvasRenderingContext2D.stroke();

        canvasRenderingContext2D.beginPath();
        canvasRenderingContext2D.roundRect(
            hashCenter.getX() - this.HASH_WIDTH / 2,
            hashCenter.getY() - this.HASH_HEIGHT / 2,
            this.HASH_WIDTH,
            this.HASH_HEIGHT,
            this.TEXT_INSET
        );
        canvasRenderingContext2D.fillStyle = fieldPalette.paperAt(alpha);
        canvasRenderingContext2D.fill();
        canvasRenderingContext2D.strokeStyle = hashing
            ? fieldPalette.accentAt(alpha)
            : fieldPalette.inkAt(0.45 * alpha);
        canvasRenderingContext2D.stroke();
        canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.8 * alpha);
        canvasRenderingContext2D.textAlign = "center";
        canvasRenderingContext2D.textBaseline = "middle";
        canvasRenderingContext2D.fillText("hash", hashCenter.getX(), hashCenter.getY());
        canvasRenderingContext2D.fillStyle = fieldPalette.inkAt(0.7 * alpha);
        canvasRenderingContext2D.textBaseline = "top";
        canvasRenderingContext2D.fillText(
            `load ${this.loadOf(hashFrame)}`,
            hashCenter.getX(),
            hashCenter.getY() + this.HASH_HEIGHT / 2 + this.TEXT_INSET
        );
    }

    private keyAt(fieldPoint: FieldPoint): number | null {
        const hashFrame: HashFrame | undefined = this.currentFrame();
        const alpha: number = this.settled ? 1 : this.sceneCycle.alpha();
        const flying: number | null = this.flyingKey();

        if (hashFrame === undefined || alpha === 0) {
            return null;
        }

        return this.markFinder.nearest(
            this.movingPoints
                .slice(0, hashFrame.getEntries())
                .map((movingPoint: MovingPoint, key: number) =>
                    key === flying
                        ? this.flightPoint(hashFrame, key)
                        : new FieldPoint(movingPoint.getX(), movingPoint.getY())
                ),
            fieldPoint,
            Math.max(this.SMALLEST_REACH, (this.nodeHeight() * this.NODE_RATIO) / 2 + 2)
        );
    }

    private targetOf(hashFrame: HashFrame, key: number): FieldPoint {
        const nodeWidth: number = this.nodeHeight() * this.NODE_RATIO;

        return new FieldPoint(
            this.tableLeft() +
                this.INDEX_WIDTH +
                this.LINK +
                nodeWidth / 2 +
                hashFrame.getDepths()[key] * (nodeWidth + this.LINK),
            this.fieldBox.getTop() + this.rowHeight * (hashFrame.getBuckets()[key] + 1.5)
        );
    }

    private hashCenter(): FieldPoint {
        return new FieldPoint(
            this.fieldBox.getLeft() + (this.fieldBox.getWidth() * this.SOURCE_SHARE) / 2,
            this.fieldBox.getTop() + this.fieldBox.getHeight() / 2
        );
    }

    private tableLeft(): number {
        return this.fieldBox.getLeft() + this.fieldBox.getWidth() * this.SOURCE_SHARE;
    }

    private nodeHeight(): number {
        return Math.max(4, this.rowHeight * this.NODE_SHARE);
    }

    private countOf(key: number): number {
        return Math.max(0, Math.min(this.groupSize, this.fieldData.getDependentRepositories() - key * this.groupSize));
    }

    private loadOf(hashFrame: HashFrame): string {
        return (hashFrame.getEntries() / hashFrame.getBucketCount()).toFixed(2);
    }
}
