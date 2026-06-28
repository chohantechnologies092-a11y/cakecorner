"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitLead(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { error: "All fields are required." };
  }

  try {
    await prisma.lead.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // Revalidate dashboard leads page so it shows the new lead
    revalidatePath("/dashboard/leads");

    return { success: true };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return { error: "Failed to submit message. Please try again later." };
  }
}
