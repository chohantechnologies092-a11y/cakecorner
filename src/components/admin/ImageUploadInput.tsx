"use client";

import { useState } from "react";

interface ImageUploadInputProps {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function ImageUploadInput({ name, defaultValue = "", placeholder = "https://...", value: controlledValue, onChange }: ImageUploadInputProps) {
  const [internalUrl, setInternalUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);

  const url = controlledValue !== undefined ? controlledValue : internalUrl;
  
  const handleUrlChange = (newUrl: string) => {
    if (onChange) onChange(newUrl);
    setInternalUrl(newUrl);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      handleUrlChange(data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input 
          type="text" 
          id={name} 
          name={name} 
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid #ddd", flex: 1 }}
          placeholder={placeholder}
        />
        <span style={{ fontSize: "0.9rem", color: "#666" }}>OR</span>
        <label style={{
          padding: "0.75rem 1rem", 
          background: "#f0f0f0", 
          borderRadius: "var(--border-radius-sm)", 
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: "600",
          border: "1px solid #ddd",
          whiteSpace: "nowrap"
        }}>
          {uploading ? "Uploading..." : "📁 Upload File"}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} disabled={uploading} />
        </label>
      </div>
      {url && (
        <div style={{ marginTop: "0.5rem" }}>
          <img src={url} alt="Preview" style={{ height: "100px", objectFit: "cover", borderRadius: "6px", border: "1px solid #eee" }} />
        </div>
      )}
    </div>
  );
}
