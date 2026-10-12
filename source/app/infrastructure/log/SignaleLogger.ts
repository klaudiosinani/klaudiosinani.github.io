import signale from "signale";

export class SignaleLogger {
    private readonly logger: signale.Signale;

    public constructor(scope: string) {
        this.logger = new signale.Signale({ scope: scope });
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public success(message: string): void {
        this.logger.success(message);
    }

    public warn(message: string): void {
        this.logger.warn(message);
    }

    public error(message: string, error: unknown): void {
        this.logger.error(`${message}: ${this.describe(error)}`);
    }

    private describe(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }

        return String(error);
    }
}
