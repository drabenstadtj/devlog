import express from "express";
import "dotenv/config";

// Import Routes
import entriesRouter from "./routes/entries";
import imagesRouter from "./routes/images";

const app = express();
const PORT = 3001;

app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
    );
    next();
});

app.options(/.*/, (_req, res) => res.sendStatus(204));

app.use(express.json());

app.use(express.static("public"));

// Register routes
app.use("/api/entries", entriesRouter);
app.use("/api/images", imagesRouter);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
