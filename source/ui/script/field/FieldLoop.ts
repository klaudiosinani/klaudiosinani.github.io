import type { FieldStep } from "./FieldStep";

export class FieldLoop {
    private readonly LONGEST_STEP: number = 0.05;
    private readonly FIRST_STEP: number = 0.016;
    private readonly MILLISECONDS: number = 1000;

    private readonly fieldStep: FieldStep;
    private frameRequest: number | null = null;
    private lastTime: number | null = null;
    private wanted: boolean = false;
    private visible: boolean = true;

    public constructor(fieldStep: FieldStep) {
        this.fieldStep = fieldStep;
    }

    public start(): void {
        this.wanted = true;
        this.request();
    }

    public stop(): void {
        this.wanted = false;
        this.cancel();
    }

    public isRunning(): boolean {
        return this.wanted;
    }

    public show(visible: boolean): void {
        this.visible = visible;

        if (visible) {
            this.request();
        } else {
            this.cancel();
        }
    }

    private request(): void {
        if (this.frameRequest !== null || !this.wanted || !this.visible) {
            return;
        }

        this.frameRequest = requestAnimationFrame((time: number) => this.tick(time));
    }

    private cancel(): void {
        if (this.frameRequest !== null) {
            cancelAnimationFrame(this.frameRequest);
        }

        this.frameRequest = null;
        this.lastTime = null;
    }

    private tick(time: number): void {
        const seconds: number =
            this.lastTime === null
                ? this.FIRST_STEP
                : Math.min((time - this.lastTime) / this.MILLISECONDS, this.LONGEST_STEP);

        this.frameRequest = null;
        this.lastTime = time;
        this.fieldStep.step(seconds);
        this.request();
    }
}
