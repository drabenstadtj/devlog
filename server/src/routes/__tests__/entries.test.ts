process.env.DB_FILE_NAME = ":memory:";
process.env.ADMIN_PASSWORD = "secret";

import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import { sqlite } from "../../db/index";
import entriesRouter from "../entries";

// bootstrap the schema on the same in-memory connection the router uses
beforeAll(() => {
    sqlite.exec(`
        CREATE TABLE IF NOT EXISTS entries (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            date TEXT,
            content TEXT NOT NULL,
            tags TEXT
        )
    `);
});

const app = express();
app.use(express.json());
app.use("/entries", entriesRouter);

const AUTH = { Authorization: "Bearer secret" };

// ─── GET /entries ─────────────────────────────────────────────────────────────

describe("GET /entries", () => {
    it("returns 200 with an array", async () => {
        const res = await request(app).get("/entries");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

// ─── POST /entries ────────────────────────────────────────────────────────────

describe("POST /entries", () => {
    it("returns 401 without auth", async () => {
        const res = await request(app)
            .post("/entries")
            .send({ title: "t", date: "01/01/2026", content: "c" });
        expect(res.status).toBe(401);
    });

    it("returns 400 when required fields are missing", async () => {
        const res = await request(app)
            .post("/entries")
            .set(AUTH)
            .send({ title: "No content" });
        expect(res.status).toBe(400);
    });

    it("creates an entry and returns its id", async () => {
        const res = await request(app)
            .post("/entries")
            .set(AUTH)
            .send({ title: "Hello World", date: "01/01/2026", content: "body" });
        expect(res.status).toBe(201);
        expect(res.body.id).toBe("hello-world");
    });

    it("returns 400 when title already exists", async () => {
        const res = await request(app)
            .post("/entries")
            .set(AUTH)
            .send({ title: "Hello World", date: "01/01/2026", content: "dupe" });
        expect(res.status).toBe(400);
    });
});

// ─── GET /entries/:id ─────────────────────────────────────────────────────────

describe("GET /entries/:id", () => {
    it("returns 404 for unknown id", async () => {
        const res = await request(app).get("/entries/does-not-exist");
        expect(res.status).toBe(404);
    });

    it("returns the entry for a known id", async () => {
        const res = await request(app).get("/entries/hello-world");
        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Hello World");
    });
});

// ─── PUT /entries/:id ─────────────────────────────────────────────────────────

describe("PUT /entries/:id", () => {
    it("returns 401 without auth", async () => {
        const res = await request(app)
            .put("/entries/hello-world")
            .send({ title: "Hello World", date: "01/01/2026", content: "updated" });
        expect(res.status).toBe(401);
    });

    it("returns 400 for unknown id", async () => {
        const res = await request(app)
            .put("/entries/does-not-exist")
            .set(AUTH)
            .send({ title: "x", date: "01/01/2026", content: "y" });
        expect(res.status).toBe(400);
    });

    it("updates an existing entry", async () => {
        const res = await request(app)
            .put("/entries/hello-world")
            .set(AUTH)
            .send({ title: "Hello World", date: "01/01/2026", content: "updated body" });
        expect(res.status).toBe(200);
        expect(res.body.id).toBe("hello-world");
    });
});

// ─── GET /entries/count ───────────────────────────────────────────────────────

describe("GET /entries/count", () => {
    it("returns a number", async () => {
        const res = await request(app).get("/entries/count");
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe("number");
    });
});

// ─── GET /entries/tags ────────────────────────────────────────────────────────

describe("GET /entries/tags", () => {
    it("returns an array", async () => {
        const res = await request(app).get("/entries/tags");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
