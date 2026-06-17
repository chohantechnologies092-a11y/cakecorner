"use client";

import { useTransition } from "react";

export default function DeleteUserButton({ 
  userId, 
  isCurrentUser, 
  deleteAction 
}: { 
  userId: string; 
  isCurrentUser: boolean; 
  deleteAction: (id: string) => Promise<void> 
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this user?")) {
      startTransition(() => {
        deleteAction(userId);
      });
    }
  };

  return (
    <button 
      type="button" 
      disabled={isCurrentUser || isPending}
      style={{ 
        padding: "0.5rem 1rem", 
        border: "1px solid #ffcdd2", 
        borderRadius: "6px", 
        background: isCurrentUser ? "#f5f5f5" : "#ffebee", 
        color: isCurrentUser ? "#999" : "#c62828", 
        cursor: isCurrentUser || isPending ? "not-allowed" : "pointer" 
      }}
      onClick={handleDelete}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
