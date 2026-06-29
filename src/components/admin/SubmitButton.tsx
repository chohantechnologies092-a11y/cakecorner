"use client";

import { useFormStatus } from "react-dom";

interface Props {
  text: string;
  loadingText?: string;
}

export default function SubmitButton({ text, loadingText = "Saving..." }: Props) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(255, 255, 255, 0.8)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)"
        }}>
          <div style={{
            width: "50px", height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid var(--color-primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1rem"
          }}></div>
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
          <h2 style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)", margin: 0 }}>{loadingText}</h2>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.5rem" }}>Please wait...</p>
        </div>
      )}
      <button 
        type="submit" 
        disabled={pending} 
        style={{ 
          padding: "0.7rem 1.8rem", 
          background: "var(--color-primary)", 
          color: "white", 
          border: "none", 
          borderRadius: "8px", 
          fontWeight: "600", 
          cursor: pending ? "wait" : "pointer", 
          fontSize: "0.9rem" 
        }}
      >
        {pending ? loadingText : text}
      </button>
    </>
  );
}
