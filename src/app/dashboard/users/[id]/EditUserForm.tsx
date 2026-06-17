"use client";

import { useState } from "react";
import Link from "next/link";
import { updateUser } from "../actions";

export default function EditUserForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Edit User</h1>
      </div>

      <form 
        action={async (formData) => {
          setLoading(true);
          setError(null);
          try {
            await updateUser(user.id, formData);
          } catch (err: any) {
            if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
            setError(err.message || "Failed to update user");
            setLoading(false);
          }
        }}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem", background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
      >
        {error && (
          <div style={{ padding: "1rem", background: "#ffebee", color: "#c62828", borderRadius: "8px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold" }}>Name</label>
          <input type="text" name="name" required defaultValue={user.name} style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold" }}>Email Address</label>
          <input type="email" name="email" required defaultValue={user.email} style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold" }}>Password (Leave blank to keep unchanged)</label>
          <input type="password" name="password" minLength={6} style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold" }}>Role</label>
          <select name="role" required defaultValue={user.role} style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd", background: "white" }}>
            <option value="EMPLOYEE">Employee (Products & Orders only)</option>
            <option value="ADMIN">Admin (Manage everything except Users)</option>
            <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
          <Link href="/dashboard/users" style={{ padding: "0.8rem 1.5rem", borderRadius: "8px", textDecoration: "none", color: "#555", border: "1px solid #ddd" }}>
            Cancel
          </Link>
          <button type="submit" disabled={loading} style={{ padding: "0.8rem 1.5rem", borderRadius: "8px", background: "var(--color-primary)", color: "white", border: "none", fontWeight: "bold", cursor: loading ? "wait" : "pointer" }}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
