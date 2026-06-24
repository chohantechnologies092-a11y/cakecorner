import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import styles from "./layout.module.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const userRole = session.user.role || "EMPLOYEE";

  return (
    <div className={`${styles.container} dashboard-scope`}>
      <Sidebar userRole={userRole} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
