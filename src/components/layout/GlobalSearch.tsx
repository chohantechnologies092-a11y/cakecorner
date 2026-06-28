"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./GlobalSearch.module.css";

interface SearchResult {
  categories: { id: string; name: string; slug: string; imageUrl: string | null }[];
  products: { id: string; name: string; price: number; imageUrl: string | null; categories: { slug: string; name: string }[] }[];
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({ categories: [], products: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults({ categories: [], products: [] });
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch search results", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResults({ categories: [], products: [] });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      handleClose();
      router.push(`/shop?search=${encodeURIComponent(query)}`);
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <>
      <button className={styles.iconBtn} aria-label="Search" onClick={() => setIsOpen(true)}>
        <div className={styles.iconCircle}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </button>

      <div className={`${styles.searchOverlay} ${isOpen ? styles.open : ""}`} onClick={handleClose}>
        <div className={styles.searchModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.searchHeader}>
            <svg className={styles.searchIcon} width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for cakes, pastries, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.searchInput}
            />
            <button className={styles.closeBtn} onClick={handleClose}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {query.trim() && (
            <div className={styles.resultsArea}>
              {loading ? (
                <div className={styles.loadingState}>Searching...</div>
              ) : results.categories.length === 0 && results.products.length === 0 ? (
                <div className={styles.noResults}>No results found for "{query}"</div>
              ) : (
                <>
                  {results.categories.length > 0 && (
                    <div>
                      <h4 className={styles.sectionTitle}>Categories</h4>
                      <div className={styles.categoriesGrid}>
                        {results.categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            className={styles.categoryPill}
                            onClick={handleClose}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.products.length > 0 && (
                    <div>
                      <h4 className={styles.sectionTitle}>Products</h4>
                      <div className={styles.productsList}>
                        {results.products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className={styles.productItem}
                            onClick={handleClose}
                          >
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
                            ) : (
                              <div className={styles.productImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎂</div>
                            )}
                            <div className={styles.productInfo}>
                              <h5 className={styles.productName}>{product.name}</h5>
                              <span className={styles.productCat}>{product.categories?.map(c => c.name).join(', ')}</span>
                            </div>
                            <div className={styles.productPrice}>£{product.price.toFixed(2)}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ textAlign: "center", paddingTop: "1rem" }}>
                     <Link 
                       href={`/shop?search=${encodeURIComponent(query)}`} 
                       onClick={handleClose}
                       style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}
                     >
                       View all results →
                     </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
