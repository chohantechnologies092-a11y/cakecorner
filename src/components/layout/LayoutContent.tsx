"use client";

import { usePathname } from "next/navigation";

export default function LayoutContent({ 
  children, 
  header, 
  footer 
}: { 
  children: React.ReactNode, 
  header: React.ReactNode, 
  footer: React.ReactNode 
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return (
    <>
      {!isDashboard && header}
      {children}
      {!isDashboard && footer}
    </>
  );
}
