"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function markLeadAsRead(id: string, isRead: boolean) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { isRead },
    });
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    console.error("Error marking lead as read:", error);
    return { error: "Failed to update lead status." };
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({
      where: { id },
    });
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return { error: "Failed to delete lead." };
  }
}
