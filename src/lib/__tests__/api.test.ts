import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    getEntries,
    getEntry,
    postEntry,
    putEntry,
    getTags,
    uploadImage,
    getEntryCount,
} from "../api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function ok(data: unknown) {
    return { ok: true, json: async () => data };
}

function err(status: number, error: string) {
    return { ok: false, status, json: async () => ({ error }) };
}

beforeEach(() => mockFetch.mockReset());

// ─── getEntries ───────────────────────────────────────────────────────────────

describe("getEntries", () => {
    it("returns entries array", async () => {
        const data = [{ id: "a", title: "Test" }];
        mockFetch.mockResolvedValue(ok(data));
        expect(await getEntries()).toEqual(data);
    });

    it("throws on failure", async () => {
        mockFetch.mockResolvedValue({ ok: false });
        await expect(getEntries()).rejects.toThrow("Failed to fetch entries");
    });

    it("calls the correct URL", async () => {
        mockFetch.mockResolvedValue(ok([]));
        await getEntries();
        expect(mockFetch).toHaveBeenCalledWith("http://localhost:3001/api/entries");
    });
});

// ─── getEntry ────────────────────────────────────────────────────────────────

describe("getEntry", () => {
    it("returns a single entry", async () => {
        const data = { id: "my-post", title: "My Post" };
        mockFetch.mockResolvedValue(ok(data));
        expect(await getEntry("my-post")).toEqual(data);
    });

    it("throws on 404", async () => {
        mockFetch.mockResolvedValue({ ok: false });
        await expect(getEntry("nope")).rejects.toThrow("Entry not found");
    });
});

// ─── postEntry ───────────────────────────────────────────────────────────────

describe("postEntry", () => {
    const entry = { title: "Hello", date: "01/01/2026", content: "body" };

    it("returns id on success", async () => {
        mockFetch.mockResolvedValue(ok({ id: "hello" }));
        expect(await postEntry(entry, "secret")).toEqual({ id: "hello" });
    });

    it("sends Authorization header", async () => {
        mockFetch.mockResolvedValue(ok({ id: "hello" }));
        await postEntry(entry, "mypassword");
        const [, options] = mockFetch.mock.calls[0];
        expect(options.headers.Authorization).toBe("Bearer mypassword");
    });

    it("throws the server error message on failure", async () => {
        mockFetch.mockResolvedValue(err(400, "Title already exists"));
        await expect(postEntry(entry, "secret")).rejects.toThrow("Title already exists");
    });

    it("throws Unauthorized on 401", async () => {
        mockFetch.mockResolvedValue(err(401, "Unauthorized"));
        await expect(postEntry(entry, "wrong")).rejects.toThrow("Unauthorized");
    });
});

// ─── putEntry ────────────────────────────────────────────────────────────────

describe("putEntry", () => {
    const entry = { id: "hello", title: "Hello", date: "01/01/2026", content: "body" };

    it("calls the correct URL with id", async () => {
        mockFetch.mockResolvedValue(ok({ id: "hello" }));
        await putEntry(entry, "secret");
        expect(mockFetch).toHaveBeenCalledWith(
            "http://localhost:3001/api/entries/hello",
            expect.objectContaining({ method: "PUT" }),
        );
    });

    it("throws the server error message on failure", async () => {
        mockFetch.mockResolvedValue(err(400, "Entry not found"));
        await expect(putEntry(entry, "secret")).rejects.toThrow("Entry not found");
    });
});

// ─── getTags ─────────────────────────────────────────────────────────────────

describe("getTags", () => {
    it("returns tags array", async () => {
        mockFetch.mockResolvedValue(ok(["react", "typescript"]));
        expect(await getTags()).toEqual(["react", "typescript"]);
    });

    it("throws on failure", async () => {
        mockFetch.mockResolvedValue({ ok: false });
        await expect(getTags()).rejects.toThrow("Failed to fetch tags");
    });
});

// ─── uploadImage ─────────────────────────────────────────────────────────────

describe("uploadImage", () => {
    it("returns absolute URL with server origin", async () => {
        mockFetch.mockResolvedValue(ok({ url: "/images/abc123" }));
        const file = new File([""], "photo.png", { type: "image/png" });
        const result = await uploadImage(file, "secret");
        expect(result.url).toBe("http://localhost:3001/images/abc123");
    });

    it("sends Authorization header", async () => {
        mockFetch.mockResolvedValue(ok({ url: "/images/abc123" }));
        const file = new File([""], "photo.png", { type: "image/png" });
        await uploadImage(file, "mypassword");
        const [, options] = mockFetch.mock.calls[0];
        expect(options.headers.Authorization).toBe("Bearer mypassword");
    });

    it("throws the server error message on failure", async () => {
        mockFetch.mockResolvedValue(err(400, "No file"));
        const file = new File([""], "photo.png", { type: "image/png" });
        await expect(uploadImage(file, "secret")).rejects.toThrow("No file");
    });
});

// ─── getEntryCount ───────────────────────────────────────────────────────────

describe("getEntryCount", () => {
    it("returns a number", async () => {
        mockFetch.mockResolvedValue(ok(5));
        expect(await getEntryCount()).toBe(5);
    });

    it("throws on failure", async () => {
        mockFetch.mockResolvedValue({ ok: false });
        await expect(getEntryCount()).rejects.toThrow("Failed to fetch count");
    });
});
