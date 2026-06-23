"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "@/app/dashboard/layout.module.css";

const ALL_NAV_ITEMS = [
  { href: "/dashboard", label: "📊 Overview", exact: true, roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"] },
  { href: "/dashboard/analytics", label: "📈 Analytics", roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"] },
  { href: "/dashboard/homepage", label: "🏠 Homepage Layout", roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/mega-menu", label: "🗂️ Mega Menu", roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/categories", label: "🏷️ Categories", roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/products", label: "🎂 Products", roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"] },
  { href: "/dashboard/orders", label: "📦 Orders", roles: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"] },
  { href: "/dashboard/nav-menu", label: "🔗 Nav Menu", roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/blogs", label: "✍️ Blogs", roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/dashboard/users", label: "👥 Users", roles: ["SUPER_ADMIN"] },
  { href: "/dashboard/settings", label: "⚙️ Settings", roles: ["SUPER_ADMIN", "ADMIN"] },
];

export default function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const allowedNavItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <>
      <button className={styles.mobileToggleBtn} onClick={() => setIsMobileOpen(true)} aria-label="Open Menu">
        ☰
      </button>

      <div 
        className={`${styles.overlay} ${isMobileOpen ? styles.mobileOpen : ""}`} 
        onClick={() => setIsMobileOpen(false)}
      />

      <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""} ${isMobileOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.logo}>
          <Image src="/logo.webp" alt="Cake Corner Logo" width={36} height={36} style={{ borderRadius: "8px", objectFit: "cover" }} />
          <span className={styles.navText}>Cake Corner</span>
        </div>
        
        <nav className={styles.nav}>
          {allowedNavItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const icon = item.label.slice(0, 2);
            const text = item.label.slice(2).trim();
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                title={isCollapsed ? text : undefined}
              >
                <span className={styles.navIcon} style={{ fontSize: "1.2rem", fontStyle: "normal" }}>{icon}</span>
                <span className={styles.navText}>{text}</span>
              </Link>
            );
          })}
          <Link href="/" className={styles.navLink} style={{ marginTop: "auto", borderTop: "1px solid #eee", paddingTop: "1rem" }} title={isCollapsed ? "Back to Store" : undefined}>
            <span className={styles.navIcon} style={{ fontSize: "1.2rem", fontStyle: "normal" }}>←</span>
            <span className={styles.navText}>Back to Store</span>
          </Link>

          <button className={styles.collapseBtn} onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? "▶" : "◀ Collapse"}
          </button>
        </nav>
      </aside>
    </>
  );
}
