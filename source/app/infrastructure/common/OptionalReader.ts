import { HttpStatusError } from "../http/response/HttpStatusError.ts";
import type { SignaleLogger } from "../log/SignaleLogger.ts";

export class OptionalReader {
    private readonly signaleLogger: SignaleLogger;

    public constructor(signaleLogger: SignaleLogger) {
        this.signaleLogger = signaleLogger;
    }

    public async read<T>(subject: string, read: () => Promise<T>): Promise<T | null> {
        try {
            return await read();
        } catch (error) {
            this.state(subject, error);

            return null;
        }
    }

    private state(subject: string, error: unknown): void {
        if (error instanceof HttpStatusError && error.isAbsent()) {
            return;
        }

        this.signaleLogger.error(`No answer for ${subject}`, error);
    }
}
