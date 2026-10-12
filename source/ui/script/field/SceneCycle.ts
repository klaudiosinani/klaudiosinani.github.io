export class SceneCycle {
    private readonly frameCount: number;
    private readonly secondsPerFrame: number;
    private readonly holdSeconds: number;
    private readonly fadeSeconds: number;
    private elapsed: number = 0;
    private round: number = 0;

    public constructor(frameCount: number, secondsPerFrame: number, holdSeconds: number, fadeSeconds: number) {
        this.frameCount = frameCount;
        this.secondsPerFrame = secondsPerFrame;
        this.holdSeconds = holdSeconds;
        this.fadeSeconds = fadeSeconds;
    }

    public advance(seconds: number): void {
        this.elapsed += seconds;

        if (this.elapsed >= this.playSeconds() + this.holdSeconds + this.fadeSeconds) {
            this.elapsed = 0;
            this.round += 1;
        }
    }

    public finish(): void {
        this.elapsed = this.playSeconds();
    }

    public frameIndex(): number {
        return Math.min(this.frameCount - 1, Math.floor(this.elapsed / this.secondsPerFrame));
    }

    public frameShare(): number {
        return this.elapsed >= this.playSeconds() ? 1 : (this.elapsed % this.secondsPerFrame) / this.secondsPerFrame;
    }

    public progress(): number {
        return Math.min(1, this.elapsed / this.playSeconds());
    }

    public isPlaying(): boolean {
        return this.elapsed < this.playSeconds();
    }

    public alpha(): number {
        const fading: number = this.elapsed - this.playSeconds() - this.holdSeconds;

        return fading <= 0 ? 1 : Math.max(0, 1 - fading / this.fadeSeconds);
    }

    public getRound(): number {
        return this.round;
    }

    private playSeconds(): number {
        return this.frameCount * this.secondsPerFrame;
    }
}
