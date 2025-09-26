import { Document, Types } from "mongoose";

export type Role = "Admin" | "Member";
export type Plan = "free" | "pro";

export interface ITenant {
    name: string;
    slug: string;
    plan: Plan;
}

export interface ITenantDocument extends ITenant, Document {
    _id: Types.ObjectId;
}

export interface IUser {
    email: string;
    passwordHash: string;
    role: Role;
    tenantId: Types.ObjectId;
}

export interface IUserDocument extends IUser, Document {
    _id: Types.ObjectId;
}

export interface INote {
    title: string;
    content: string;
    tenantId: Types.ObjectId;
    authorId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface INoteDocument extends INote, Document {
    _id: Types.ObjectId;
}
