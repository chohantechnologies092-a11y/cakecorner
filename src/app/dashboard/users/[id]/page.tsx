import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import EditUserForm from "./EditUserForm";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  return <EditUserForm user={user} />;
}
