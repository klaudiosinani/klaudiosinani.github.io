import satori from "satori";
import type { CollectionEntry } from "astro:content";

import { DatetimeFormatter } from "@app/util/datetime/DatetimeFormatter.ts";
import { GoogleFontLoader } from "@app/infrastructure/render/og/font/GoogleFontLoader.ts";

const DATETIME_FORMATTER: DatetimeFormatter = new DatetimeFormatter();
const GOOGLE_FONT_LOADER: GoogleFontLoader = new GoogleFontLoader();
export default async function PostOgImage(post: CollectionEntry<"blog">): Promise<string> {
    const published: string = DATETIME_FORMATTER.formatDate(post.data.pubDatetime);

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
                        <p
                            style={{
                                fontSize: 64,
                                fontWeight: "bold",
                                margin: 0,
                                maxHeight: "230px",
                                overflow: "hidden",
                            }}
                        >
                            {post.data.title}
                        </p>
                        <p
                            style={{
                                fontSize: 30,
                                marginTop: "18px",
                                maxHeight: "150px",
                                overflow: "hidden",
                            }}
                        >
                            {post.data.description}
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
                        <span style={{ overflow: "hidden", fontWeight: "bold" }}>{published}</span>

                        <span style={{ overflow: "hidden", fontWeight: "bold" }}>{post.data.author}</span>
                    </div>
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
            embedFont: true,
            fonts: await GOOGLE_FONT_LOADER.load(
                post.data.title + post.data.description + post.data.author + published
            ),
        }
    );
}
