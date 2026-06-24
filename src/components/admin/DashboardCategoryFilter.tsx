"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

interface Category {
  id: string;
  name: string;
}

export default function DashboardCategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const currentCategoryId = searchParams.get("category") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("category", value);
      } else {
        params.delete("category");
      }
      params.delete("page"); // Reset pagination when filtering
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div style={{ position: "relative", minWidth: "200px" }}>
      <select
        value={currentCategoryId}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "0.6rem 2rem 0.6rem 1rem",
          border: "1px solid var(--color-border-glass, #ddd)",
          borderRadius: "8px",
          fontSize: "0.9rem",
          outline: "none",
          backgroundColor: "var(--color-background-glass, #fff)",
          color: "var(--color-text-main, #333)",
          transition: "border-color 0.3s",
          appearance: "none",
          cursor: "pointer",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--color-border-glass, #ddd)")}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-text-light, #888)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
      {isPending && (
        <div style={{ position: "absolute", right: "30px", top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid #ccc", borderTopColor: "var(--color-primary)", animation: "spin 1s linear infinite" }} />
        </div>
      )}
    </div>
  );
}
