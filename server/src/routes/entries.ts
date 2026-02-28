import { db } from "../db/index";
import { Router, Request, Response, NextFunction } from "express";
import { entries } from "../db/schema";
import { eq } from "drizzle-orm";

function requireAuth(req: Request, res: Response, next: NextFunction) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password || req.headers.authorization !== `Bearer ${password}`) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    next();
}

const entriesRouter = Router();

// get all entries
entriesRouter.get("/", (_req, res) => {
    // query db for entry with this id
    const all = db.select().from(entries).all();

    //check if exists
    if (all.length === 0) {
        // return 404 if not
        res.status(404).json({ error: "No entries found" });
        return;
    }

    // return it as JSON
    res.json(all);
    return;
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
            tags: tags,
        })
        .run();
    res.status(201).json({ id });

    return;
});

export default entriesRouter;
