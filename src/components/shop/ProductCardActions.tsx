'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function ProductCardActions({ product }: { product: any }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const allSizes = product.baseSize 
      ? [{ id: 'base', name: product.baseSize, priceModifier: product.price }, ...product.sizes]
      : product.sizes;
      
    const selectedSize = allSizes?.[0] || null;
    const selectedFlavor = product.flavors?.[0] || null;
    
    const finalPrice = selectedSize && selectedSize.priceModifier > 0 
      ? selectedSize.priceModifier 
      : product.price;

    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      imageUrl: product.imageUrl,
      size: selectedSize?.name,
      flavor: selectedFlavor?.name,
    });
    alert("Added to cart successfully!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={handleAddToCart} 
          style={{ flex: 1, padding: '0.6rem', background: 'white', color: 'var(--color-primary)', border: '2px solid var(--color-primary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#f0faf9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          🛒 Add
        </button>
        <button 
          onClick={handleBuyNow} 
          style={{ flex: 1, padding: '0.6rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-primary-dark)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          ⚡ Buy
        </button>
      </div>
      <Link 
        href={`/product/${product.id}`} 
        style={{ display: 'block', textAlign: 'center', padding: '0.6rem', background: '#f5f5f5', color: '#333', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.2s' }}
        onMouseOver={(e) => { e.currentTarget.style.background = '#e0e0e0'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        👁️ View Details
      </Link>
    </div>
  );
}
