import satori from "satori";
import type { RepositoryOgDetails } from "@app/infrastructure/render/og/details/RepositoryOgDetails";
import { SITE } from "@app/configuration/site/Site";

import type { RepositoryOgFigure } from "@app/infrastructure/render/og/details/RepositoryOgFigure";

import { GoogleFontLoader } from "@app/infrastructure/render/og/font/GoogleFontLoader.ts";

const GOOGLE_FONT_LOADER: GoogleFontLoader = new GoogleFontLoader();
export default async function RepositoryOgImage(repository: RepositoryOgDetails): Promise<string> {
    return satori(
        <div
            style={{
                background: "#fefbfb",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "-1px",
                    right: "-1px",
                    border: "4px solid #000",
                    background: "#ecebeb",
                    opacity: "0.9",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "center",
                    margin: "2.5rem",
                    width: "88%",
                    height: "80%",
                }}
            />

            <div
                style={{
                    border: "4px solid #000",
                    background: "#fefbfb",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "center",
                    margin: "2rem",
                    width: "88%",
                    height: "80%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        margin: "20px",
                        width: "90%",
                        height: "90%",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <p style={{ fontSize: 72, fontWeight: "bold", margin: 0 }}>{repository.getName()}</p>
                            {repository.getVersion() && (
                                <span
                                    style={{
                                        border: "3px solid #000",
                                        borderRadius: "8px",
                                        padding: "4px 16px",
                                        fontSize: 30,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {repository.getVersion()}
                                </span>
                            )}
                        </div>
                        <p
                            style={{
                                fontSize: 34,
                                marginTop: "14px",
                                maxHeight: "150px",
                                overflow: "hidden",
                            }}
                        >
                            {repository.getLogline()}
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "72px" }}>
                        {repository.getFigures().map((figure: RepositoryOgFigure) => (
                            <div key={figure.getLabel()} style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: 54, fontWeight: "bold" }}>{figure.getValue()}</span>
                                <span style={{ fontSize: 26 }}>{figure.getLabel()}</span>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            marginBottom: "8px",
                            fontSize: 28,
                        }}
                    >
                        <span style={{ overflow: "hidden", fontWeight: "bold" }}>{repository.getAddress()}</span>
                        <span style={{ overflow: "hidden", fontWeight: "bold" }}>{SITE.getTitle()}</span>
                    </div>
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
            embedFont: true,
            fonts: await GOOGLE_FONT_LOADER.load(
                repository.getName() +
                    repository.getLogline() +
                    repository.getAddress() +
                    repository.getVersion() +
                    repository
                        .getFigures()
                        .map((figure: RepositoryOgFigure) => figure.getValue() + figure.getLabel())
                        .join("") +
                    SITE.getTitle()
            ),
        }
    );
}
