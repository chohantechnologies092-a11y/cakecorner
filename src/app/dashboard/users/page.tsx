import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteUser } from "./actions";
import DeleteUserButton from "./DeleteUserButton";

export default async function UsersPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>👥 User Management</h1>
        <Link 
          href="/dashboard/users/new" 
          style={{ background: "var(--color-primary)", color: "white", padding: "0.8rem 1.5rem", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}
        >
          + Add New User
        </Link>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
              <th style={{ padding: "1rem" }}>Name</th>
              <th style={{ padding: "1rem" }}>Email</th>
              <th style={{ padding: "1rem" }}>Role</th>
              <th style={{ padding: "1rem" }}>Joined</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "1rem" }}>{user.name}</td>
                <td style={{ padding: "1rem" }}>{user.email}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    padding: "0.3rem 0.8rem", 
                    borderRadius: "20px", 
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    background: user.role === "SUPER_ADMIN" ? "#e3f2fd" : user.role === "ADMIN" ? "#fff3e0" : "#f1f8e9",
                    color: user.role === "SUPER_ADMIN" ? "#1565c0" : user.role === "ADMIN" ? "#e65100" : "#33691e"
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "1rem", textAlign: "right", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                  <Link href={`/dashboard/users/${user.id}`} style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#333" }}>
                    Edit
                  </Link>
                  <DeleteUserButton 
                    userId={user.id} 
                    isCurrentUser={user.id === session.user.id} 
                    deleteAction={deleteUser} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
