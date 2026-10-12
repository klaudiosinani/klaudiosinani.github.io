import { SignaleLogger } from "./SignaleLogger.ts";

export class SignaleLoggerFactory {
    public create(scope: string): SignaleLogger {
        return new SignaleLogger(scope);
    }
}
