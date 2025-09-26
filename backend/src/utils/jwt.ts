import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? "supersecret";

export interface JwtPayload {
    userId: string;
    tenantId: string;
    role: "Admin" | "Member";
}

export function signJwt(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
