"use client";

import { useState } from "react";
import { resetAnalytics } from "@/lib/actions";

export default function ResetAnalyticsButton() {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all analytics data? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      await resetAnalytics();
      alert("Analytics data has been reset successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to reset analytics. Make sure you have admin rights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleReset}
      disabled={loading}
      style={{ 
        background: "#ffebee", 
        color: "#d32f2f", 
        padding: "0.8rem 1.2rem", 
        borderRadius: "8px", 
        border: "1px solid #ffcdd2", 
        fontWeight: "bold", 
        fontSize: "0.9rem", 
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? "Resetting..." : "Reset All Analytics"}
    </button>
  );
}
