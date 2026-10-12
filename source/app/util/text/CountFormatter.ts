export class CountFormatter {
    public of(value: number, noun: string): string {
        return `${value} ${value === 1 ? noun : `${noun}s`}`;
    }
}
