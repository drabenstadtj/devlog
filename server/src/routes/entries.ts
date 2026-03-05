import { db } from "../db/index";
import { Router, Request, Response, NextFunction } from "express";
import { entries } from "../db/schema";
import { eq, count } from "drizzle-orm";
import requireAuth from "../utils/auth";
const entriesRouter = Router();

// get all entries
entriesRouter.get("/", (_req, res) => {
    // query db for entry with this id
    const all = db
        .select()
        .from(entries)
        .all()
        .map((e) => ({
            ...e,
            tags: e.tags ? e.tags.split(",").map((t) => t.trim()) : [],
        }));

    //check if exists
    if (all.length === 0) {
        res.json([]);
        return;
    }

    // return it as JSON
    res.json(all);
    return;
});

entriesRouter.get("/tags", (_req, res) => {
    const rows = db.select({ tags: entries.tags }).from(entries).all();
    const allTags = rows.flatMap((r) =>
        r.tags ? r.tags.split(",").map((t) => t.trim()) : [],
    );

    const unique = [...new Set(allTags)];

    res.json(unique);
});

entriesRouter.get("/count", (_req, res) => {
    const result = db.select({ count: count() }).from(entries).get();
    res.json(result?.count ?? 0);
});

// get entry by id
entriesRouter.get("/:id", (req, res) => {
    const { id } = req.params;

    // query db for entry with this id
    const entry = db.select().from(entries).where(eq(entries.id, id)).get();

    //check if exists
    if (!entry) {
        // return 404 if not
        res.status(404).json({ error: "Entry not found" });
        return;
    }

    // return it as JSON
    res.json(entry);
    return;
});

entriesRouter.post("/", requireAuth, (req, res) => {
    const { title, date, description, content, tags } = req.body;

    if (!title || !date || !content) {
        res.status(400).json({
            error: "Title, date, and content are required",
        });
        return;
    }
    const id = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    const entry = db.select().from(entries).where(eq(entries.id, id)).get();

    //check if exists
    if (entry) {
        // return 404 if not
        res.status(400).json({ error: "Entry by that title already exists" });
        return;
    }

    // insert into db...
    db.insert(entries)
        .values({
            id: id,
            title: title,
            description: description,
            date: date,
            content: content,
            tags: tags ? tags.join(",") : null,
        })
        .run();
    res.status(201).json({ id });

    return;
});

entriesRouter.put("/:id", requireAuth, (req, res) => {
    const id = req.params.id as string;
    const { title, date, description, content, tags } = req.body;

    if (!title || !date || !content) {
        res.status(400).json({
            error: "Title, date, and content are required",
        });
        return;
    }

    const entry = db.select().from(entries).where(eq(entries.id, id)).get();

    //check if exists
    if (!entry) {
        // return 404 if not
        res.status(400).json({ error: "That entry does not exist" });
        return;
    }

    db.update(entries)
        .set({
            title: title,
            description: description,
            date: date,
            content: content,
            tags: tags ? tags.join(",") : null,
        })
        .where(eq(entries.id, id))
        .run();
    res.status(200).json({ id });

    return;
});

export default entriesRouter;
