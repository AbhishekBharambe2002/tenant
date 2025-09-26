import React, { useState, useEffect, JSX } from "react";
import { listNotes, createNote, deleteNote, login, upgradeTenant } from "./api";
import { Note } from "./types";
import "./App.css"

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      setError(null);
      onLogin();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Login failed");
    }
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
      </div>
      <button type="submit">Login</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [tenantPlan, setTenantPlan] = useState<"free" | "pro">("free");

  async function load() {
    try {
      const notesResp = await listNotes();
      setNotes(notesResp);
      setError(null);
    } catch (err) {
      setError(String(err));
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newNote = await createNote(title, content);
      setNotes(prev => [newNote, ...prev]);
      setTitle(""); setContent("");
      setError(null);
    } catch (err) {
      setError(String(err));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      setError(String(err));
    }
  }

  async function handleUpgrade() {
    const slug = prompt("Enter your tenant slug (acme or globex):");
    if (!slug) return;
    try {
      await upgradeTenant(slug);
      setTenantPlan("pro");
      setError(null);
      alert("Upgraded to pro. You can create more notes now.");
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div>
      <h2>Notes</h2>
      <form onSubmit={handleCreate}>
        <input value={title} placeholder="Title" onChange={e => setTitle(e.target.value)} required />
        <textarea value={content} placeholder="Content" onChange={e => setContent(e.target.value)} required />
        <button type="submit">Create</button>
      </form>

      {tenantPlan === "free" && notes.length >= 3 && (
        <div>
          <strong>Free plan limit reached (3). </strong>
          <button onClick={handleUpgrade}>Upgrade to Pro</button>
        </div>
      )}

      {error && <div style={{ color: "red" }}>{error}</div>}

      <ul>
        {notes.map(n => (
          <li key={n._id}>
            <h4>{n.title}</h4>
            <p>{n.content}</p>
            <button onClick={() => handleDelete(n._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App(): JSX.Element {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  function onLogin() {
    setToken(localStorage.getItem("token"));
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Notes App</h1>
      {!token ? <LoginForm onLogin={onLogin} /> : (
        <>
          <button onClick={logout}>Logout</button>
          <NotesApp />
        </>
      )}
    </div>
  );
}
