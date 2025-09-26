import mongoose, { Schema } from "mongoose";
import { INoteDocument } from "./types";

const NoteSchema = new Schema<INoteDocument>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});

export const NoteModel = mongoose.model<INoteDocument>("Note", NoteSchema);
