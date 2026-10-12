import type { SignaleLoggerFactory } from "../log/SignaleLoggerFactory.ts";
import { OptionalReader } from "./OptionalReader.ts";

export class OptionalReaderFactory {
    private readonly signaleLoggerFactory: SignaleLoggerFactory;

    public constructor(signaleLoggerFactory: SignaleLoggerFactory) {
        this.signaleLoggerFactory = signaleLoggerFactory;
    }

    public create(scope: string): OptionalReader {
        return new OptionalReader(this.signaleLoggerFactory.create(scope));
    }
}
