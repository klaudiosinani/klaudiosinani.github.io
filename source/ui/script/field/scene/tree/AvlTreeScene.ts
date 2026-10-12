import type { AvlTreeLayout } from "./AvlTreeLayout";
import type { FieldData } from "@app/feature/field/FieldData";
import type { FieldPalette } from "../../FieldPalette";
import type { FieldScene } from "../../FieldScene";
import type { MonthVolume } from "@app/feature/field/MonthVolume";
import type { NumberFormatter } from "@app/util/text/NumberFormatter";
import type { SceneBoxFactory } from "../../SceneBoxFactory";
import type { TreeEdge } from "./TreeEdge";
import { AvlTree } from "./AvlTree";
import { FieldBox } from "../../FieldBox";
import { FieldPoint } from "../../FieldPoint";
import { MarkFinder } from "../../MarkFinder";
import { MovingPoint } from "../../MovingPoint";
import { TreeArrangement } from "./TreeArrangement";

export class AvlTreeScene implements FieldScene {
    private readonly SECONDS_PER_INSERT: number = 0.9;
    private readonly HOLD_SECONDS: number = 6;
    private readonly FADE_SECONDS: number = 1.2;
    private readonly HIGHLIGHT_SECONDS: number = 1.2;
    private readonly LEVELS: number = 9;
    private readonly SMOOTHING: number = 4;
    private readonly SMALLEST_RADIUS: number = 1.4;
    private readonly RADIUS_RANGE: number = 3.4;
    private readonly RING_RADIUS: number = 8;
    private readonly REACH: number = 12;

    private readonly fieldData: FieldData;
    private readonly avlTreeLayout: AvlTreeLayout;
    private readonly sceneBoxFactory: SceneBoxFactory;
    private readonly numberFormatter: NumberFormatter;
    private readonly largestDownloads: number;
    private readonly markFinder: MarkFinder = new MarkFinder();
    private avlTree: AvlTree = new AvlTree();
    private fieldBox: FieldBox = new FieldBox(0, 0, 1, 1);
    private treeArrangement: TreeArrangement = new TreeArrangement(new Map(), []);
    private readonly movingPoints: Map<number, MovingPoint> = new Map();
    private highlighted: number[] = [];
    private inserted: number = 0;
    private sinceInsert: number = 0;
    private sinceFull: number = 0;
    private sinceHighlight: number = 0;
    private pointed: FieldPoint | null = null;

    public constructor(
        fieldData: FieldData,
        avlTreeLayout: AvlTreeLayout,
        sceneBoxFactory: SceneBoxFactory,
        numberFormatter: NumberFormatter
    ) {
        this.fieldData = fieldData;
        this.avlTreeLayout = avlTreeLayout;
        this.sceneBoxFactory = sceneBoxFactory;
        this.numberFormatter = numberFormatter;
        this.largestDownloads = Math.max(
            1,
            ...fieldData.getMonthVolumes().map((monthVolume: MonthVolume) => monthVolume.getDownloads())
        );
    }

    public layout(width: number, height: number): void {
        this.fieldBox = this.sceneBoxFactory.create(width, height);
        this.rearrange();
        this.treeArrangement
            .getPositions()
            .forEach((fieldPoint: FieldPoint, order: number) => this.movingPoints.get(order)?.place(fieldPoint));
    }

    public advance(seconds: number): void {
        const count: number = this.fieldData.getMonthVolumes().length;

        this.sinceHighlight += seconds;

        if (this.inserted < count) {
            this.sinceInsert += seconds;

            while (this.sinceInsert >= this.SECONDS_PER_INSERT && this.inserted < count) {
                this.sinceInsert -= this.SECONDS_PER_INSERT;
                this.insertNext();
            }
        } else {
            this.sinceFull += seconds;

            if (this.sinceFull >= this.HOLD_SECONDS + this.FADE_SECONDS) {
                this.reset();
            }
        }

        const share: number = 1 - Math.exp(-this.SMOOTHING * seconds);

        this.treeArrangement
            .getPositions()
            .forEach((fieldPoint: FieldPoint, order: number) =>
                this.movingPoints.get(order)?.approach(fieldPoint, share)
            );
    }

    public settle(): void {
        this.reset();

        while (this.inserted < this.fieldData.getMonthVolumes().length) {
            this.insertNext();
        }

        this.highlighted = [];
        this.treeArrangement
            .getPositions()
            .forEach((fieldPoint: FieldPoint, order: number) => this.movingPoints.get(order)?.place(fieldPoint));
    }

    public draw(canvasRenderingContext2D: CanvasRenderingContext2D, fieldPalette: FieldPalette): void {
        const alpha: number = this.alpha();

        canvasRenderingContext2D.lineWidth = 1;
        canvasRenderingContext2D.strokeStyle = fieldPalette.inkAt(0.28 * alpha);
        canvasRenderingContext2D.beginPath();
        this.treeArrangement.getTreeEdges().forEach((treeEdge: TreeEdge) => {
            const parentPoint: MovingPoint | undefined = this.movingPoints.get(treeEdge.getParentOrder());
            const childPoint: MovingPoint | undefined = this.movingPoints.get(treeEdge.getChildOrder());

            if (parentPoint && childPoint) {
                canvasRenderingContext2D.moveTo(parentPoint.getX(), parentPoint.getY());
                canvasRenderingContext2D.lineTo(childPoint.getX(), childPoint.getY());
            }
        });
        canvasRenderingContext2D.stroke();

        const newest: number = this.inserted - 1;

        this.movingPoints.forEach((movingPoint: MovingPoint, order: number) => {
            const monthVolume: MonthVolume = this.fieldData.getMonthVolumes()[order];
            const radius: number =
                this.SMALLEST_RADIUS +
                this.RADIUS_RANGE * Math.sqrt(monthVolume.getDownloads() / this.largestDownloads);

            canvasRenderingContext2D.fillStyle =
                order === newest ? fieldPalette.accentAt(alpha) : fieldPalette.inkAt(0.5 * alpha);
            canvasRenderingContext2D.beginPath();
            canvasRenderingContext2D.arc(movingPoint.getX(), movingPoint.getY(), radius, 0, Math.PI * 2);
            canvasRenderingContext2D.fill();
        });

        const pointedOrder: number | null = this.pointed === null ? null : this.orderAt(this.pointed);
        const pointedPoint: MovingPoint | undefined =
            pointedOrder === null ? undefined : this.movingPoints.get(pointedOrder);

        if (pointedPoint) {
            canvasRenderingContext2D.strokeStyle = fieldPalette.inkAt(0.7 * alpha);
            canvasRenderingContext2D.beginPath();
            canvasRenderingContext2D.arc(pointedPoint.getX(), pointedPoint.getY(), this.RING_RADIUS, 0, Math.PI * 2);
            canvasRenderingContext2D.stroke();
        }

        const glow: number = Math.max(0, 1 - this.sinceHighlight / this.HIGHLIGHT_SECONDS);

        if (glow > 0) {
            canvasRenderingContext2D.strokeStyle = fieldPalette.accentAt(0.7 * glow * alpha);
            this.highlighted.forEach((order: number) => {
                const movingPoint: MovingPoint | undefined = this.movingPoints.get(order);

                if (movingPoint) {
                    canvasRenderingContext2D.beginPath();
                    canvasRenderingContext2D.arc(
                        movingPoint.getX(),
                        movingPoint.getY(),
                        this.RING_RADIUS,
                        0,
                        Math.PI * 2
                    );
                    canvasRenderingContext2D.stroke();
                }
            });
        }
    }

    public caption(): string {
        return "An AVL tree of my monthly downloads, kept in balance.";
    }

    public ticker(): string {
        const monthVolumes: readonly MonthVolume[] = this.fieldData.getMonthVolumes();

        if (monthVolumes.length === 0 || this.inserted === 0) {
            return "";
        }

        if (this.inserted === monthVolumes.length) {
            return `${monthVolumes.length} months of downloads in one balanced tree`;
        }

        return this.wordsOf(monthVolumes[this.inserted - 1]);
    }

    public labelAt(fieldPoint: FieldPoint): string | null {
        const order: number | null = this.orderAt(fieldPoint);

        return order === null ? null : this.wordsOf(this.fieldData.getMonthVolumes()[order]);
    }

    public point(fieldPoint: FieldPoint | null): void {
        this.pointed = fieldPoint;
    }

    private orderAt(fieldPoint: FieldPoint): number | null {
        const orders: number[] = [...this.movingPoints.keys()];
        const found: number | null = this.markFinder.nearest(
            [...this.movingPoints.values()].map(
                (movingPoint: MovingPoint) => new FieldPoint(movingPoint.getX(), movingPoint.getY())
            ),
            fieldPoint,
            this.REACH
        );

        return found === null || this.alpha() === 0 ? null : orders[found];
    }

    private wordsOf(monthVolume: MonthVolume): string {
        return `${monthVolume.getLabel()}: ${this.numberFormatter.exact(monthVolume.getDownloads())} downloads`;
    }

    private insertNext(): void {
        const monthVolume: MonthVolume = this.fieldData.getMonthVolumes()[this.inserted];
        const path: number[] = this.avlTree.insert(monthVolume.getDownloads(), this.inserted);
        const parentOrder: number | undefined = path[path.length - 2];
        const parentPoint: MovingPoint | undefined =
            parentOrder === undefined ? undefined : this.movingPoints.get(parentOrder);

        this.rearrange();

        const target: FieldPoint | undefined = this.treeArrangement.getPositions().get(this.inserted);
        const startX: number = parentPoint?.getX() ?? target?.getX() ?? 0;
        const startY: number = parentPoint?.getY() ?? target?.getY() ?? 0;

        this.movingPoints.set(this.inserted, new MovingPoint(startX, startY));
        this.highlighted = path;
        this.sinceHighlight = 0;
        this.inserted += 1;
    }

    private rearrange(): void {
        this.treeArrangement = this.avlTreeLayout.arrange(this.avlTree, this.fieldBox, this.LEVELS);
    }

    private reset(): void {
        this.avlTree = new AvlTree();
        this.movingPoints.clear();
        this.highlighted = [];
        this.inserted = 0;
        this.sinceInsert = 0;
        this.sinceFull = 0;
        this.rearrange();
    }

    private alpha(): number {
        if (this.sinceFull <= this.HOLD_SECONDS) {
            return 1;
        }

        return Math.max(0, 1 - (this.sinceFull - this.HOLD_SECONDS) / this.FADE_SECONDS);
    }
}
