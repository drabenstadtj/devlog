import { Router, Request, Response, NextFunction } from "express";
import requireAuth from "../utils/auth";
import multer from "multer";

const upload = multer({ dest: "public/images/" });
const imagesRouter = Router();

// add an image to the db
imagesRouter.post(
    "/upload",
    requireAuth,
    upload.single("image"),
    (req, res) => {
        if (!req.file) return res.status(400).json({ error: "No file" });
        res.json({ url: `/images/${req.file.filename}` });
    },
);

export default imagesRouter;
