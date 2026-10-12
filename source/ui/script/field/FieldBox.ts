export class FieldBox {
    private readonly left: number;
    private readonly top: number;
    private readonly width: number;
    private readonly height: number;

    public constructor(left: number, top: number, width: number, height: number) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    public getLeft(): number {
        return this.left;
    }

    public getTop(): number {
        return this.top;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }
}
