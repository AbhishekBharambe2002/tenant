import { Note } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE as string;


export async function login(email: string, password: string): Promise<string> {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json() as { token: string };
    return data.token;
}

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("token") ?? "";
    return { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function listNotes(): Promise<Note[]> {
    const res = await fetch(`${API_BASE}/notes`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to list notes");
    return res.json();
}

export async function createNote(title: string, content: string): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, content })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create note");
    }
    return res.json();
}

export async function deleteNote(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Delete failed");
}

export async function upgradeTenant(slug: string): Promise<void> {
    const res = await fetch(`${API_BASE}/tenants/${encodeURIComponent(slug)}/upgrade`, {
        method: "POST",
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upgrade failed");
    }
}
