"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductBasicInfo {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface CategoryProductSelectorProps {
  products: ProductBasicInfo[];
  initialSelectedIds?: string[];
}

export default function CategoryProductSelector({ products, initialSelectedIds = [] }: CategoryProductSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProduct = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Select Products in this Category</label>
      
      {/* Search Input */}
      <input 
        type="text" 
        placeholder="Search products..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.9rem" }}
      />
      
      {/* Scrollable List */}
      <div style={{ 
        border: "1px solid #ddd", 
        borderRadius: "8px", 
        height: "300px", 
        overflowY: "auto", 
        background: "#fafafa" 
      }}>
        {filteredProducts.length === 0 ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "#888", fontSize: "0.9rem" }}>
            No products found matching "{searchQuery}"
          </div>
        ) : (
          filteredProducts.map(product => {
            const isSelected = selectedIds.has(product.id);
            return (
              <label 
                key={product.id} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.8rem", 
                  padding: "0.8rem 1rem", 
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  background: isSelected ? "#f0faf9" : "transparent",
                  transition: "background 0.2s"
                }}
              >
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => toggleProduct(product.id)}
                  style={{ width: "1.2rem", height: "1.2rem", accentColor: "var(--color-primary)" }}
                />
                
                {product.imageUrl ? (
                  <div style={{ position: "relative", width: "32px", height: "32px", borderRadius: "4px", overflow: "hidden" }}>
                    <Image src={product.imageUrl} alt={product.name} fill sizes="32px" style={{ objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ width: "32px", height: "32px", background: "#eee", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🎂</div>
                )}
                
                <span style={{ fontSize: "0.95rem", fontWeight: isSelected ? "600" : "400", color: "#333" }}>
                  {product.name}
                </span>
              </label>
            );
          })
        )}
      </div>

      <div style={{ fontSize: "0.85rem", color: "#666", display: "flex", justifyContent: "space-between" }}>
        <span>{selectedIds.size} products selected</span>
        <button 
          type="button" 
          onClick={() => setSelectedIds(new Set())}
          style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}
        >
          Clear all
        </button>
      </div>

      {/* Hidden inputs to submit selected IDs with the form */}
      {Array.from(selectedIds).map(id => (
        <input key={id} type="hidden" name="productIds" value={id} />
      ))}
    </div>
  );
}
