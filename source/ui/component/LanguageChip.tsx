import type { JSX } from "react";

import { LanguageColorResolver } from "@app/util/language/LanguageColorResolver.ts";
import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";

const LANGUAGE_COLOR_RESOLVER: LanguageColorResolver = new LanguageColorResolver();
const NUMBER_FORMATTER: NumberFormatter = new NumberFormatter();
export interface LanguageChipProps {
    readonly language: string;
    readonly share?: number;
}

export default function LanguageChip({ language, share }: LanguageChipProps): JSX.Element {
    const color: string | null = LANGUAGE_COLOR_RESOLVER.resolve(language);

    return (
        <span className="chip">
            <span
                className={color ? "language-dot" : "language-dot language-dot-none"}
                style={color ? { backgroundColor: color } : undefined}
                aria-hidden="true"
            />
            {language}
            {share !== undefined && <span className="chip-share">{NUMBER_FORMATTER.share(share)}</span>}
        </span>
    );
}
