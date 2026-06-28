"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function markLeadAsRead(id: string, isRead: boolean, formData?: FormData) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { isRead },
    });
    revalidatePath("/dashboard/leads");
  } catch (error) {
    console.error("Error marking lead as read:", error);
  }
}

export async function deleteLead(id: string, formData?: FormData) {
  try {
    await prisma.lead.delete({
      where: { id },
    });
    revalidatePath("/dashboard/leads");
  } catch (error) {
    console.error("Error deleting lead:", error);
  }
}
