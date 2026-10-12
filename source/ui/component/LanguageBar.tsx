import type { JSX } from "react";

import { LanguageColorResolver } from "@app/util/language/LanguageColorResolver.ts";
import { NumberFormatter } from "@app/util/text/NumberFormatter.ts";

const LANGUAGE_COLOR_RESOLVER: LanguageColorResolver = new LanguageColorResolver();
const NUMBER_FORMATTER: NumberFormatter = new NumberFormatter();
export interface LanguageShare {
    readonly name: string;
    readonly share: number;
}

export interface LanguageBarProps {
    readonly languages: readonly LanguageShare[];
}

export default function LanguageBar({ languages }: LanguageBarProps): JSX.Element {
    return (
        <div
            className="language-bar"
            role="img"
            aria-label={languages
                .map(({ name, share }: LanguageShare) => `${name} ${NUMBER_FORMATTER.share(share)}`)
                .join(", ")}
        >
            {languages.map(({ name, share }: LanguageShare) => {
                const color: string | null = LANGUAGE_COLOR_RESOLVER.resolve(name);

                return (
                    <span
                        key={name}
                        className={color ? "language-bar-part" : "language-bar-part language-bar-part-none"}
                        style={{
                            width: `${share * 100}%`,
                            ...(color ? { backgroundColor: color } : {}),
                        }}
                    />
                );
            })}
        </div>
    );
}
