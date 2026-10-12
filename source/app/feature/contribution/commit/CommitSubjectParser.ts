import type { CommitMessage } from "@app/util/text/CommitMessage";
import { CommitSubject } from "./CommitSubject";

export class CommitSubjectParser {
    private readonly commitMessage: CommitMessage;
    private readonly TICKET: RegExp = /^\[?([A-Z][A-Z0-9]+-\d+)\]?[\s:-]*/;
    private readonly NO_TICKET: RegExp = /^\[[A-Z][A-Z-]*\]\s*/;

    public constructor(commitMessage: CommitMessage) {
        this.commitMessage = commitMessage;
    }

    public parse(message: string): CommitSubject {
        const first: string = this.commitMessage.subject(message);
        const ticket: RegExpExecArray | null = this.TICKET.exec(first);

        if (ticket) {
            return new CommitSubject(ticket[1], first.slice(ticket[0].length).trim());
        }

        return new CommitSubject(null, first.replace(this.NO_TICKET, "").trim());
    }
}
