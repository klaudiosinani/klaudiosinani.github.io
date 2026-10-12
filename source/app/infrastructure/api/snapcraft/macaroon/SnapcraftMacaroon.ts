export class SnapcraftMacaroon {
    private readonly body: Buffer;
    private readonly signature: Buffer;

    public constructor(body: Buffer, signature: Buffer) {
        this.body = body;
        this.signature = signature;
    }

    public getBody(): Buffer {
        return this.body;
    }

    public getSignature(): Buffer {
        return this.signature;
    }
}
