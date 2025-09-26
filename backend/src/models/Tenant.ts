import mongoose, { Schema } from "mongoose";
import { ITenantDocument } from "./types";

const TenantSchema = new Schema<ITenantDocument>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    plan: { type: String, required: true, enum: ["free", "pro"], default: "free" }
});

export const TenantModel = mongoose.model<ITenantDocument>("Tenant", TenantSchema);
