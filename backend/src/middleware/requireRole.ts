import { Response, NextFunction } from "express";
import { RequestWithUser } from "./auth";

export function requireRole(role: "Admin" | "Member") {
    return (req: RequestWithUser, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({ error: "Insufficient permissions" });
            return;
        }
        next();
    };
}
