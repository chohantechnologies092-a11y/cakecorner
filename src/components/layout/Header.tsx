"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useEffect, useState, useRef } from "react";
import styles from "./Header.module.css";

import GlobalSearch from "./GlobalSearch";

interface NavItem {
  id: string;
  label: string;
  url: string;
  openNewTab: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

interface HeaderProps {
  navItems: NavItem[];
  categories: Category[];
}

function CartIcon({ count }: { count: number }) {
  return (
    <Link href="/checkout" className={styles.iconBtn}>
      <div className={styles.iconCircle}>
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      {count > 0 && (
        <span className={styles.cartBadge}>
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Header({ navItems = [], categories = [] }: HeaderProps) {
  const { count } = useCart();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.innerWidth > 900) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setMegaOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth > 900) {
      hoverTimeoutRef.current = setTimeout(() => {
        setMegaOpen(false);
      }, 200);
    }
  };

  const renderNavItem = (item: NavItem) => {
    if (item.label.toLowerCase() === "cakes") {
      return (
        <div key={item.id} className={styles.navItemWrapper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          <a 
            href={item.url} 
            className={styles.navLink} 
            onClick={(e) => {
              // On mobile, click toggles the mega menu instead of navigating right away
              if (typeof window !== 'undefined' && window.innerWidth <= 900) {
                e.preventDefault();
                setMegaOpen(!megaOpen);
              }
            }}
          >
            {item.label}
            <svg className={`${styles.chevron} ${megaOpen ? styles.open : ''}`} width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          {megaOpen && categories.length > 0 && (
            <div className={styles.megaMenuWrapper}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <div className={styles.megaMenuDropdown}>
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/shop?category=${cat.slug}`} className={styles.megaItem} onClick={() => setMegaOpen(false)}>
                    <div className={styles.megaImageWrapper}>
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt={cat.name} className={styles.megaImage} />
                      ) : (
                        <div className={styles.megaPlaceholder}>🎂</div>
                      )}
                    </div>
                    <span className={styles.megaTitle}>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <Link key={item.id} href={item.url} className={styles.navLink} target={item.openNewTab ? "_blank" : undefined}>
        {item.label}
      </Link>
    );
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.floatingPill}>
        
        {/* Mobile Hamburger Button */}
        <button className={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoImageWrapper}>
              <img src="/logo.webp" alt="Cake Corner Logo" className={styles.logoImg} />
            </div>
            <div className={styles.logoTextWrapper}>
              <h1 className={styles.logoTitle}>Cake Corner</h1>
            </div>
          </Link>
        </div>

        {/* Center Navigation */}
        <nav className={`${styles.navCenter} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          {navItems.map(renderNavItem)}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <GlobalSearch />
          <CartIcon count={count} />
        </div>
        
        {/* Mobile menu overlay */}
        {mobileMenuOpen && <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)}></div>}
        
      </div>
    </header>
  );
}
