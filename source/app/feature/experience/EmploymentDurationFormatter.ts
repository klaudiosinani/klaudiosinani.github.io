import type { ExperienceRole } from "@app/configuration/experience/ExperienceRole";
import { EmploymentDuration } from "./EmploymentDuration";

export class EmploymentDurationFormatter {
    private readonly MONTHS: readonly string[] = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    public format(from: string, to: string | null, today: Date): EmploymentDuration {
        const start: [number, number] = this.monthOf(from);
        const end: [number, number] = to ? this.monthOf(to) : [today.getUTCFullYear(), today.getUTCMonth() + 1];

        return new EmploymentDuration(
            this.say(start),
            to ? this.say(end) : "Present",
            this.length(this.months(start, end)),
            to === null,
            from,
            to
        );
    }

    public across(spans: readonly ExperienceRole[], today: Date): EmploymentDuration {
        const first: string = spans.map((span: ExperienceRole) => span.getFrom()).sort()[0];
        const held: boolean = spans.some((span: ExperienceRole) => span.getTo() === null);
        const last: string | null = held
            ? null
            : spans
                  .map((span: ExperienceRole) => span.getTo() as string)
                  .sort()
                  .reverse()[0];

        return this.format(first, last, today);
    }

    private months([fromYear, fromMonth]: [number, number], [toYear, toMonth]: [number, number]): number {
        return Math.max(1, (toYear - fromYear) * 12 + (toMonth - fromMonth) + 1);
    }

    private length(months: number): string {
        const years: number = Math.floor(months / 12);
        const rest: number = months % 12;
        const said: string[] = [];

        if (years > 0) {
            said.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
        }

        if (rest > 0) {
            said.push(`${rest} ${rest === 1 ? "mo" : "mos"}`);
        }

        return said.join(" ");
    }

    private monthOf(value: string): [number, number] {
        const [year, month] = value.split("-");

        return [Number(year), Number(month)];
    }

    private say([year, month]: [number, number]): string {
        return `${this.MONTHS[month - 1]} ${year}`;
    }
}
