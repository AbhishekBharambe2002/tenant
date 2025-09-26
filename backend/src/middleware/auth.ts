import { Request, Response, NextFunction } from "express";
import { verifyJwt, JwtPayload } from "../utils/jwt";

export interface RequestWithUser extends Request {
    user?: {
        userId: string;
        tenantId: string;
        role: "Admin" | "Member";
    };
}

export function requireAuth(req: RequestWithUser, res: Response, next: NextFunction): void {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Missing or invalid Authorization header" });
        return;
    }
    const token = authHeader.substring(7);
    try {
        const payload: JwtPayload = verifyJwt(token);
        req.user = {
            userId: payload.userId,
            tenantId: payload.tenantId,
            role: payload.role
        };
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}
