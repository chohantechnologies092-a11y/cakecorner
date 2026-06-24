"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export default function DashboardSearch({ placeholder = "Search..." }: { placeholder?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.delete("page"); // Reset pagination when searching
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
        style={{
          width: "100%",
          padding: "0.6rem 1rem 0.6rem 2.5rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          fontSize: "0.9rem",
          outline: "none",
          transition: "border-color 0.3s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
      />
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#888"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      {isPending && (
        <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid #ccc", borderTopColor: "var(--color-primary)", animation: "spin 1s linear infinite" }} />
        </div>
      )}
    </div>
  );
}
