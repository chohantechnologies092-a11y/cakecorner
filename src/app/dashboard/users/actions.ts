"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function createUser(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !role) {
    throw new Error("All fields are required.");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  if (session.user.id === id) {
    throw new Error("You cannot delete your own account.");
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/dashboard/users");
}

export async function updateUser(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !role) {
    throw new Error("Name, email, and role are required.");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser && existingUser.id !== id) {
    throw new Error("Another user with this email already exists.");
  }

  const dataToUpdate: any = { name, email, role };
  
  if (password && password.trim() !== "") {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id },
    data: dataToUpdate,
  });

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}
