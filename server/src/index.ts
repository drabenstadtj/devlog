import express from "express";
import "dotenv/config";

// Import Routes
import entriesRouter from "./routes/entries";

const app = express();
const PORT = 3001;

app.use(express.json());

// Register routes
app.use("/api/entries", entriesRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
