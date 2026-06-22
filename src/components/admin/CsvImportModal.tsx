"use client";

import { useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";

export default function CsvImportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch("/api/products/import", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(results.data),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Failed to import");
          }

          setSuccess(data.message);
          setFile(null);
          setTimeout(() => {
            setIsOpen(false);
            setSuccess(null);
            router.refresh(); // Refresh page to show new products
          }, 2000);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      error: (err: any) => {
        setError(err.message);
        setLoading(false);
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: "0.6rem 1.4rem", background: "#fff", border: "1px solid #ddd", color: "#333", borderRadius: "var(--border-radius-sm)", cursor: "pointer", fontWeight: "500", fontSize: "0.9rem" }}
      >
        Import CSV
      </button>

      {isOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Import Shopify CSV</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Upload a Shopify Product CSV file to bulk import your products.</p>
            
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem", border: "1px dashed #ccc", borderRadius: "6px" }} 
            />
            
            {error && <div style={{ padding: "0.75rem", background: "#fff0f0", color: "#d32f2f", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}
            {success && <div style={{ padding: "0.75rem", background: "#f0faf9", color: "var(--color-primary)", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem" }}>{success}</div>}

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ padding: "0.6rem 1.2rem", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleImport}
                disabled={!file || loading}
                style={{ padding: "0.6rem 1.2rem", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500", opacity: (!file || loading) ? 0.6 : 1 }}
              >
                {loading ? "Importing..." : "Confirm Import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
