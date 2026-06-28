"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import styles from "./ProductDetails.module.css";
import "react-quill-new/dist/quill.snow.css";

interface ProductDetailsProps {
  product: any;
  pickupLocation?: string;
}

export default function ProductDetails({ product, pickupLocation }: ProductDetailsProps) {
  const { addItem } = useCart();

  // State
  const allImages = [product.imageUrl, ...product.images.map((i: any) => i.url)].filter(Boolean);
  
  const allSizes = product.baseSize 
    ? [{ id: 'base', name: product.baseSize, priceModifier: product.price }, ...product.sizes]
    : product.sizes;
    
  const allQuantityOptions = product.quantityOptions || [];

  const [activeImage, setActiveImage] = useState(allImages[0] || "");
  const [selectedSize, setSelectedSize] = useState<any>(allSizes[0] || null);
  const [selectedFlavor, setSelectedFlavor] = useState<any>(product.flavors[0] || null);
  const [selectedTierFlavors, setSelectedTierFlavors] = useState<Record<string, string>>(() => {
    if (!product.tiers || product.tiers.length === 0) return {};
    const initial: Record<string, string> = {};
    product.tiers.forEach((tier: any) => {
      if (tier.flavors && tier.flavors.length > 0) {
        initial[tier.name] = tier.flavors[0].name;
      }
    });
    return initial;
  });
  const [selectedQuantityOption, setSelectedQuantityOption] = useState<any>(allQuantityOptions[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [customFlavorQuantities, setCustomFlavorQuantities] = useState<Record<string, number>>({});
  const [purchaseMode, setPurchaseMode] = useState<'standard' | 'custom'>('standard');

  const isPhotoCake = product.isPhotoCake === true;

  const updateCustomFlavorQuantity = (flavorName: string, delta: number) => {
    setCustomFlavorQuantities(prev => {
      const current = prev[flavorName] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [flavorName]: next };
    });
  };

  const totalSelectedCustomItems = Object.values(customFlavorQuantities).reduce((a, b) => a + b, 0);

  let finalPrice = product.price;

  if (purchaseMode === 'standard') {
    if (selectedSize && selectedSize.priceModifier > 0) {
      finalPrice = selectedSize.priceModifier;
    }
  } else if (purchaseMode === 'custom') {
    if (totalSelectedCustomItems > 0) {
      finalPrice = (product.customPiecePrice || product.price) * totalSelectedCustomItems;
    }
  }

  if (selectedQuantityOption && selectedQuantityOption.priceModifier > 0) {
    finalPrice += selectedQuantityOption.priceModifier;
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    if (product.isCustomAssortment && purchaseMode === 'custom' && totalSelectedCustomItems === 0) {
      alert("Please select at least one item for your custom package.");
      return;
    }

    let finalFlavor = selectedFlavor?.name;
    if (product.isCustomAssortment && purchaseMode === 'custom') {
      const selections = Object.entries(customFlavorQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([name, qty]) => `${qty}x ${name}`)
        .join(', ');
      finalFlavor = selections || 'No Flavors Selected';
    } else if (product.tiers && product.tiers.length > 0) {
      finalFlavor = product.tiers.map((t: any) => `${t.name}: ${selectedTierFlavors[t.name] || 'None'}`).join(' | ');
    }

    const cartSize = (product.isCustomAssortment && purchaseMode === 'custom') ? `Custom Box (${totalSelectedCustomItems} items)` : selectedSize?.name;

    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      imageUrl: product.imageUrl,
      size: cartSize,
      flavor: finalFlavor,
      quantityOption: selectedQuantityOption?.name,
      photoUrl: photoPreview || undefined,
    });
    
    // Add multiple times if quantity > 1
    for(let i=1; i<quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: finalPrice,
        imageUrl: product.imageUrl,
        size: cartSize,
        flavor: finalFlavor,
        quantityOption: selectedQuantityOption?.name,
        photoUrl: photoPreview || undefined,
      });
    }

    alert("Added to cart successfully!");
  };

  return (
    <div className={styles.container}>
      
      {/* Gallery Section */}
      <div className={styles.gallery}>
        <div className={styles.mainImageWrapper}>
          {activeImage ? (
            <Image src={activeImage} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.mainImage} style={{ objectFit: "cover" }} />
          ) : (
            <div className={styles.placeholder}>🎂</div>
          )}
        </div>
        
        {allImages.length > 1 && (
          <div className={styles.thumbnails}>
            {allImages.map((img: string, idx: number) => (
              <button key={idx} onClick={() => setActiveImage(img)} className={`${styles.thumbnailBtn} ${activeImage === img ? styles.active : ''}`} style={{ position: "relative" }}>
                <Image src={img} alt="Thumbnail" fill sizes="100px" className={styles.thumbnailImg} style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className={styles.details}>
        <div className={styles.titleArea}>
          <span className={styles.category}>{product.categories?.map((c: any) => c.name).join(', ') || "Bakery"}</span>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.price}>
            £{finalPrice.toFixed(2)}
            {product.isCustomAssortment && purchaseMode === 'custom' && totalSelectedCustomItems === 0 && (
              <span style={{ fontSize: "1rem", color: "#666", fontWeight: "normal", marginLeft: "8px" }}>/ piece</span>
            )}
          </p>
          {product.isPickupAvailable && (
            <div style={{ marginTop: "0.5rem" }}>
              <button 
                onClick={() => setShowPickupModal(true)} 
                style={{ background: "#fff5e6", color: "var(--color-secondary)", border: "1px solid var(--color-secondary)", padding: "0.5rem 1rem", borderRadius: "50px", fontWeight: "bold", fontSize: "0.85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                🏬 Store Pickup Available
              </button>
            </div>
          )}
        </div>

        {/* Pickup Modal */}
        {showPickupModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowPickupModal(false)}>
            <div style={{ background: "white", padding: "2rem", borderRadius: "16px", maxWidth: "400px", width: "90%", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontSize: "1.5rem", fontFamily: "var(--font-heading)", marginBottom: "1rem" }}>Pickup Location</h3>
              <p style={{ fontSize: "1rem", color: "#555", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                You can pick up this item from our store located at: <br/><br/>
                <strong>{pickupLocation || "145 Ladypool Road, Birmingham"}</strong>
              </p>
              <button onClick={() => setShowPickupModal(false)} style={{ width: "100%", background: "var(--color-primary)", color: "white", border: "none", padding: "0.8rem", borderRadius: "8px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        )}

        {product.isCustomAssortment && (
          <div className={styles.selectionGroup}>
            <label className={styles.selectionLabel}>Purchase Option</label>
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "1rem", fontWeight: purchaseMode === 'standard' ? 'bold' : 'normal', color: purchaseMode === 'standard' ? '#d81b60' : '#333' }}>
                <input 
                  type="radio" 
                  name="purchaseMode" 
                  checked={purchaseMode === 'standard'} 
                  onChange={() => setPurchaseMode('standard')} 
                  style={{ width: "18px", height: "18px", accentColor: "#d81b60" }}
                />
                Standard Pack
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "1rem", fontWeight: purchaseMode === 'custom' ? 'bold' : 'normal', color: purchaseMode === 'custom' ? '#d81b60' : '#333' }}>
                <input 
                  type="radio" 
                  name="purchaseMode" 
                  checked={purchaseMode === 'custom'} 
                  onChange={() => setPurchaseMode('custom')} 
                  style={{ width: "18px", height: "18px", accentColor: "#d81b60" }}
                />
                Build Custom Pack
              </label>
            </div>
          </div>
        )}

        {(!product.isCustomAssortment || purchaseMode === 'standard') && allSizes.length > 0 && (
          <div className={styles.selectionGroup}>
            <label className={styles.selectionLabel}>Select Size</label>
            <div className={styles.optionsGrid}>
              {allSizes.map((size: any) => (
                <button key={size.id} onClick={() => setSelectedSize(size)} className={`${styles.optionBtn} ${selectedSize?.id === size.id ? styles.active : ''}`}>
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.isCustomAssortment && purchaseMode === 'custom' ? (
          <div className={styles.selectionGroup}>
            <label className={styles.selectionLabel}>Build Your Custom Package</label>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem" }}>Select the quantities for each flavor below:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {product.flavors.map((flavor: any) => {
                const qty = customFlavorQuantities[flavor.name] || 0;
                return (
                  <div key={flavor.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1rem", background: "#fdf8fb", borderRadius: "8px", border: "1px solid #f8e5f0" }}>
                    <span style={{ fontWeight: "bold", fontSize: "0.95rem" }}>{flavor.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <button onClick={() => updateCustomFlavorQuantity(flavor.name, -1)} style={{ background: "white", border: "1px solid #ddd", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontWeight: "bold", color: "#d81b60" }}>-</button>
                      <span style={{ minWidth: "20px", textAlign: "center", fontWeight: "bold" }}>{qty}</span>
                      <button onClick={() => updateCustomFlavorQuantity(flavor.name, 1)} style={{ background: "#d81b60", border: "none", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontWeight: "bold", color: "white" }}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            {Object.values(customFlavorQuantities).reduce((a, b) => a + b, 0) > 0 && (
              <div style={{ marginTop: "1rem", padding: "0.8rem", background: "#f0fdf4", color: "#166534", borderRadius: "8px", textAlign: "center", fontWeight: "bold", fontSize: "0.95rem", border: "1px solid #bbf7d0" }}>
                Total Selected: {Object.values(customFlavorQuantities).reduce((a, b) => a + b, 0)} Items
              </div>
            )}
          </div>
        ) : product.tiers && product.tiers.length > 0 ? (
          product.tiers.map((tier: any, idx: number) => (
            <div key={idx} className={styles.selectionGroup}>
              <label className={styles.selectionLabel}>Flavor for {tier.name}</label>
              <div className={styles.optionsGrid}>
                {tier.flavors.map((flavor: any) => (
                  <button 
                    key={flavor.id} 
                    onClick={() => setSelectedTierFlavors(prev => ({ ...prev, [tier.name]: flavor.name }))} 
                    className={`${styles.optionBtn} ${selectedTierFlavors[tier.name] === flavor.name ? styles.active : ''}`}
                  >
                    {flavor.name}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (!product.isCustomAssortment || purchaseMode === 'standard') && product.flavors.length > 0 ? (
          <div className={styles.selectionGroup}>
            <label className={styles.selectionLabel}>Select Flavor</label>
            <div className={styles.optionsGrid}>
              {product.flavors.map((flavor: any) => (
                <button key={flavor.id} onClick={() => setSelectedFlavor(flavor)} className={`${styles.optionBtn} ${selectedFlavor?.id === flavor.id ? styles.active : ''}`}>
                  {flavor.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        
        {allQuantityOptions.length > 0 && (
          <div className={styles.selectionGroup}>
            <label className={styles.selectionLabel}>Quantity</label>
            <div className={styles.optionsGrid}>
              {allQuantityOptions.map((q: any) => (
                <button key={q.id} onClick={() => setSelectedQuantityOption(q)} className={`${styles.optionBtn} ${selectedQuantityOption?.id === q.id ? styles.active : ''}`}>
                  {q.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {isPhotoCake && (
          <div className={styles.photoUpload}>
            <span className={styles.photoUploadTitle}>📸 Upload Photo for Cake (Optional)</span>
            <p className={styles.photoUploadDesc}>You can optionally upload a clear, high-quality image to be printed on your cake.</p>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className={styles.fileInput} />
            {photoPreview && (
              <img src={photoPreview} alt="Preview" className={styles.photoPreview} />
            )}
          </div>
        )}

        <div className={styles.actionArea}>
          <div className={styles.qtyControl}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.qtyBtn}>-</button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className={styles.qtyBtn}>+</button>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', flex: 1 }}>
            <button onClick={handleAddToCart} className={styles.addToCartBtn} style={{ flex: 1, justifyContent: "center", padding: "0 1.5rem" }}>
              <span>🛒 Add to Cart</span>
            </button>
            <button onClick={() => { handleAddToCart(); window.location.href = '/checkout'; }} className={styles.buyNowBtn} style={{ flex: 1, justifyContent: "center", padding: "0 1.5rem" }}>
              <span>⚡ Buy Now</span>
            </button>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: "2rem", marginTop: "1rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Product Details</h3>
          <div 
            className={`${styles.description} ql-editor`}
            style={{ padding: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }} 
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />
        </div>
      </div>

    </div>
  );
}
