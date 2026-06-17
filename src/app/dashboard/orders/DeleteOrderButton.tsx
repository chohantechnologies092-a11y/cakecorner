"use client";

import { useTransition } from "react";
import { deleteOrder } from "@/lib/actions";

export default function DeleteOrderButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      startTransition(async () => {
        try {
          await deleteOrder(id);
        } catch (error) {
          alert("Failed to delete order. Make sure you have permission.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      style={{
        padding: "0.35rem 0.6rem",
        background: "#fee2e2",
        color: "#b91c1c",
        border: "none",
        borderRadius: "6px",
        fontSize: "0.85rem",
        cursor: isPending ? "wait" : "pointer",
        transition: "all 0.2s",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isPending ? 0.7 : 1
      }}
      title="Delete Order"
    >
      {isPending ? "⏳" : "🗑️"}
    </button>
  );
}
