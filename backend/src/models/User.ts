import mongoose, { Schema, Types } from "mongoose";
import { IUserDocument } from "./types";

const UserSchema = new Schema<IUserDocument>({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["Admin", "Member"] },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true }
});

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
