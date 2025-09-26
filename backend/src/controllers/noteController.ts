import { Request, Response } from "express";
import { NoteModel } from "../models/Note";
import { TenantModel } from "../models/Tenant";
import { RequestWithUser } from "../middleware/auth";
import mongoose from "mongoose";

export async function createNote(req: RequestWithUser, res: Response): Promise<void> {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const { title, content } = req.body as { title: string; content: string };

    // check plan limits
    const tenant = await TenantModel.findById(req.user.tenantId).exec();
    if (!tenant) {
        res.status(400).json({ error: "Tenant not found" });
        return;
    }

    if (tenant.plan === "free") {
        const count = await NoteModel.countDocuments({ tenantId: tenant._id }).exec();
        if (count >= 3) {
            res.status(403).json({ error: "Free plan limit reached. Upgrade to pro." });
            return;
        }
    }

    const note = new NoteModel({
        title,
        content,
        tenantId: new mongoose.Types.ObjectId(req.user.tenantId),
        authorId: new mongoose.Types.ObjectId(req.user.userId)
    });

    await note.save();
    res.status(201).json(note);
}

export async function listNotes(req: RequestWithUser, res: Response): Promise<void> {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const notes = await NoteModel.find({ tenantId: req.user.tenantId }).sort({ createdAt: -1 }).exec();
    res.json(notes);
}

export async function getNote(req: RequestWithUser, res: Response): Promise<void> {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const id = req.params.id;
    const note = await NoteModel.findOne({ _id: id, tenantId: req.user.tenantId }).exec();
    if (!note) {
        res.status(404).json({ error: "Note not found" });
        return;
    }
    res.json(note);
}

export async function updateNote(req: RequestWithUser, res: Response): Promise<void> {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const id = req.params.id;
    const payload = req.body as { title?: string; content?: string };
    const note = await NoteModel.findOneAndUpdate(
        { _id: id, tenantId: req.user.tenantId },
        { $set: payload },
        { new: true }
    ).exec();

    if (!note) {
        res.status(404).json({ error: "Note not found" });
        return;
    }
    res.json(note);
}

export async function deleteNote(req: RequestWithUser, res: Response): Promise<void> {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const id = req.params.id;
    const result = await NoteModel.findOneAndDelete({ _id: id, tenantId: req.user.tenantId }).exec();
    if (!result) {
        res.status(404).json({ error: "Note not found" });
        return;
    }
    res.json({ success: true });
}
