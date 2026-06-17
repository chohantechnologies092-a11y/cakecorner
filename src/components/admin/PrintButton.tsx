"use client";

import React from "react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      style={{
        padding: "0.6rem 1.2rem",
        background: "var(--color-primary)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.95rem"
      }}
    >
      🖨️ Print Order
    </button>
  );
}
