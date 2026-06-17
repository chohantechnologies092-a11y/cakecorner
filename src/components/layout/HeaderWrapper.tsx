// This is a server component that fetches nav data and passes it to the client Header
import { prisma } from "@/lib/db";
import Header from "./Header";

export default async function HeaderWrapper() {
  const [navItems, categories] = await Promise.all([
    prisma.navMenuItem.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({
      where: { isVisible: true, showInMegaMenu: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return <Header navItems={navItems} categories={categories} />;
}
