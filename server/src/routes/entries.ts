import { db } from "../db/index";
import { Router } from "express";
import { entries } from "../db/schema";
import { eq } from "drizzle-orm";

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

export default entriesRouter;
