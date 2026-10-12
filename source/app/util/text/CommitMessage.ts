export class CommitMessage {
    public subject(message: string): string {
        return message.split("\n")[0].trim();
    }
}
