import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { AUTHOR_PORTRAIT } from "@app/configuration/AuthorPortrait";
import { HttpClient } from "@app/infrastructure/http/HttpClient.ts";
import { PortraitDownloadService } from "@app/infrastructure/assets/service/PortraitDownloadService";

const underTest: typeof PortraitDownloadService = PortraitDownloadService;

const BYTES: number[] = [137, 80, 78, 71];

const body = (): Blob => new Blob([new Uint8Array(BYTES)]);

const picture = (type: string, status: number = 200): Response =>
    new Response(body(), { status, headers: { "content-type": type } });

const answering = (answer: Response | null): MockInstance =>
    vi.spyOn(HttpClient.shared, "send").mockResolvedValue(answer as Response | null);

const directory = async (): Promise<string> => await mkdtemp(join(tmpdir(), "portrait-"));

afterEach(() => {
    vi.restoreAllMocks();
});

describe("PortraitDownloadService.store", () => {
    it("givenGitHubAnswersWithAJpeg_whenStoring_thenItIsHeldUnderTheEndingOfAJpeg", async () => {
        const held: string = await directory();
        answering(picture("image/jpeg"));

        const stored: string | null = await new PortraitDownloadService(held).store();

        expect(stored).toBe("/portrait.jpg");
        expect([...(await readFile(`${held}/portrait.jpg`))]).toEqual(BYTES);

        await rm(held, { recursive: true });
    });

    it("givenGitHubAnswersWithAPng_whenStoring_thenItIsHeldUnderTheEndingOfAPng", async () => {
        const held: string = await directory();
        answering(picture("image/png"));

        expect(await new underTest(held).store()).toBe("/portrait.png");

        await rm(held, { recursive: true });
    });

    it("givenTheTypeStatesACharacterSet_whenStoring_thenTheTypeAloneIsRead", async () => {
        const held: string = await directory();
        answering(picture("image/png; charset=binary"));

        expect(await new underTest(held).store()).toBe("/portrait.png");

        await rm(held, { recursive: true });
    });

    it("givenAPictureOfAnotherTypeIsHeld_whenStoring_thenItIsTakenAway", async () => {
        const held: string = await directory();
        answering(picture("image/jpeg"));
        await new underTest(held).store();

        answering(picture("image/png"));

        await new underTest(held).store();

        await expect(readFile(`${held}/portrait.jpg`)).rejects.toThrow();
        expect([...(await readFile(`${held}/portrait.png`))]).toEqual(BYTES);

        await rm(held, { recursive: true });
    });

    it("givenGitHubAnswers_whenStoring_thenTheAddressOfTheAccountIsRead", async () => {
        const held: string = await directory();
        const send: MockInstance = answering(picture("image/png"));

        await new underTest(held).store();

        expect(send.mock.calls[0][0]).toBe(AUTHOR_PORTRAIT.source);

        await rm(held, { recursive: true });
    });

    it("givenAnAnswerThatIsNotAPicture_whenStoring_thenNothingIsWritten", async () => {
        const held: string = await directory();
        answering(picture("text/html"));

        expect(await new underTest(held).store()).toBeNull();

        await rm(held, { recursive: true });
    });

    it("givenAnAnswerWithNoType_whenStoring_thenNothingIsWritten", async () => {
        const held: string = await directory();
        answering(new Response(body(), { status: 200, headers: {} }));

        expect(await new underTest(held).store()).toBeNull();

        await rm(held, { recursive: true });
    });

    it("givenGitHubDoesNotAnswer_whenStoring_thenNothingIsClaimed", async () => {
        answering(null);

        expect(await new underTest().store()).toBeNull();
    });

    it("givenGitHubAnswersWithAFault_whenStoring_thenNoFileIsWritten", async () => {
        const held: string = await directory();
        answering(picture("text/html", 404));

        const stored: string | null = await new PortraitDownloadService(held).store();

        expect(stored).toBeNull();
        await expect(readFile(`${held}/portrait.jpg`)).rejects.toThrow();

        await rm(held, { recursive: true });
    });
});
