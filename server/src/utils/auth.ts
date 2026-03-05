import { Request, Response, NextFunction } from "express";

export default function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password || req.headers.authorization !== `Bearer ${password}`) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    next();
}
