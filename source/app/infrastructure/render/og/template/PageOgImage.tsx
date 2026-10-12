import satori from "satori";
import type { PageOgDetails } from "../details/PageOgDetails";
import { SITE } from "@app/configuration/site/Site";

import { GoogleFontLoader } from "@app/infrastructure/render/og/font/GoogleFontLoader.ts";

const GOOGLE_FONT_LOADER: GoogleFontLoader = new GoogleFontLoader();

export default async function PageOgImage(page: PageOgDetails): Promise<string> {
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
                        <p style={{ fontSize: 72, fontWeight: "bold", margin: 0 }}>{page.getTitle()}</p>
                        <p
                            style={{
                                fontSize: 32,
                                marginTop: "14px",
                                maxHeight: "220px",
                                overflow: "hidden",
                            }}
                        >
                            {page.getDescription()}
                        </p>
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
                        <span style={{ overflow: "hidden", fontWeight: "bold" }}>{page.getAddress()}</span>
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
                page.getTitle() + page.getDescription() + page.getAddress() + SITE.getTitle()
            ),
        }
    );
}
