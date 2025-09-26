export type Role = "Admin" | "Member";

export interface Note {
    _id: string;
    title: string;
    content: string;
    tenantId: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Tenant {
    name: string;
    slug: string;
    plan: "free" | "pro";
}
