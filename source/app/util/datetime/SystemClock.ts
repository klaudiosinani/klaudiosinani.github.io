export class SystemClock {
    public currentYear(): number {
        return new Date().getFullYear();
    }

    public now(): Date {
        return new Date();
    }
}
