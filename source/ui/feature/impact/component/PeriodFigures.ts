import type { ImpactFigure } from "./ImpactFigure";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export type PeriodFigures = Record<ReportingPeriod, Record<string, ImpactFigure>>;
