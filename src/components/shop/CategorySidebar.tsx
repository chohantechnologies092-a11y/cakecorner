"use client";

import { useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategorySidebar({
  categories,
  currentSlug,
  styles,
}: {
  categories: Category[];
  currentSlug: string | undefined;
  styles: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.sidebarWidget}>
      <h3 className={styles.sidebarTitle}>Categories</h3>
      
      {/* Category Search Input */}
      <div className={styles.searchInputWrapper} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Find a category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          style={{ padding: "0.4rem 1rem" }}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")} 
            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', paddingRight: '10px' }}
          >
            ✕
          </button>
        )}
      </div>

      <ul className={styles.categoryList}>
        <li>
          <Link
            href="/shop"
            className={`${styles.categoryLink} ${
              !currentSlug ? styles.categoryActive : ""
            }`}
          >
            <span className={styles.catName}>All Treats</span>
          </Link>
        </li>
        {filteredCategories.map((cat) => {
          const isActive = currentSlug === cat.slug;
          return (
            <li key={cat.id}>
              <Link
                href={`/shop?category=${cat.slug}`}
                className={`${styles.categoryLink} ${
                  isActive ? styles.categoryActive : ""
                }`}
              >
                <span className={styles.catName}>{cat.name}</span>
              </Link>
            </li>
          );
        })}
        {filteredCategories.length === 0 && (
          <li style={{ padding: '1rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
            No categories found.
          </li>
        )}
      </ul>
    </div>
  );
}
