import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import { signJwt } from "../utils/jwt";

export async function loginHandler(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
        res.status(400).json({ error: "email and password required" });
        return;
    }

    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }

    const token = signJwt({
        userId: user._id.toString(),
        tenantId: user.tenantId.toString(),
        role: user.role
    });

    res.json({ token });
}
