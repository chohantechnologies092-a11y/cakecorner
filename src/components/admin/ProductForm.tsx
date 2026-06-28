"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions";
import ImageUploadInput from "@/components/admin/ImageUploadInput";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useRef, useMemo } from 'react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface Category { id: string; name: string; }
interface Size { id?: string; name: string; priceModifier: number; }
interface Flavor { id?: string; name: string; }
interface QuantityOption { id?: string; name: string; priceModifier: number; }
interface Image { id?: string; url: string; altText?: string | null; }
interface TierFlavor { id?: string; name: string; }
interface Tier { id?: string; name: string; flavors: TierFlavor[]; }

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    categories?: Category[];
    isFeatured: boolean;
    isVisible: boolean;
    isPhotoCake: boolean;
    isCustomAssortment: boolean;
    isPickupAvailable: boolean;
    baseSize?: string | null;
    imageUrl?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalUrl?: string | null;
    sizes: Size[];
    flavors: Flavor[];
    tiers?: Tier[];
    quantityOptions?: QuantityOption[];
    images: Image[];
  };
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState<Size[]>(initialData?.sizes || []);
  const [flavors, setFlavors] = useState<Flavor[]>(initialData?.flavors || []);
  const [tiers, setTiers] = useState<Tier[]>(initialData?.tiers || []);
  const [quantityOptions, setQuantityOptions] = useState<QuantityOption[]>(initialData?.quantityOptions || []);
  const [images, setImages] = useState<Image[]>(initialData?.images || []);
  const [featuredImage, setFeaturedImage] = useState(initialData?.imageUrl || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryIds, setCategoryIds] = useState<string[]>(initialData?.categories?.map(c => c.id) || []);
  const quillRef = useRef<any>(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const uploadData = new FormData();
      uploadData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', data.url);
      } catch (err) {
        console.error(err);
        alert('Failed to upload image.');
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const addSize = () => setSizes([...sizes, { name: "", priceModifier: 0 }]);
  const updateSize = (idx: number, field: keyof Size, value: any) => {
    const newSizes = [...sizes];
    newSizes[idx] = { ...newSizes[idx], [field]: value };
    setSizes(newSizes);
  };
  const removeSize = (idx: number) => setSizes(sizes.filter((_, i) => i !== idx));

  const addFlavor = () => setFlavors([...flavors, { name: "" }]);
  const updateFlavor = (idx: number, value: string) => {
    const newFlavors = [...flavors];
    newFlavors[idx].name = value;
    setFlavors(newFlavors);
  };
  const removeFlavor = (idx: number) => setFlavors(flavors.filter((_, i) => i !== idx));

  const addTier = () => setTiers([...tiers, { name: "", flavors: [] }]);
  const updateTierName = (idx: number, name: string) => {
    const newTiers = [...tiers];
    newTiers[idx].name = name;
    setTiers(newTiers);
  };
  const removeTier = (idx: number) => setTiers(tiers.filter((_, i) => i !== idx));

  const addTierFlavor = (tierIdx: number) => {
    const newTiers = [...tiers];
    newTiers[tierIdx].flavors.push({ name: "" });
    setTiers(newTiers);
  };
  const updateTierFlavor = (tierIdx: number, fIdx: number, value: string) => {
    const newTiers = [...tiers];
    newTiers[tierIdx].flavors[fIdx].name = value;
    setTiers(newTiers);
  };
  const removeTierFlavor = (tierIdx: number, fIdx: number) => {
    const newTiers = [...tiers];
    newTiers[tierIdx].flavors = newTiers[tierIdx].flavors.filter((_, i) => i !== fIdx);
    setTiers(newTiers);
  };

  const addQuantityOption = () => setQuantityOptions([...quantityOptions, { name: "", priceModifier: 0 }]);
  const updateQuantityOption = (idx: number, field: keyof QuantityOption, value: any) => {
    const newOpts = [...quantityOptions];
    newOpts[idx] = { ...newOpts[idx], [field]: value };
    setQuantityOptions(newOpts);
  };
  const removeQuantityOption = (idx: number) => setQuantityOptions(quantityOptions.filter((_, i) => i !== idx));

  const addImage = () => setImages([...images, { url: "", altText: "" }]);
  const updateImage = (idx: number, field: keyof Image, value: string) => {
    const newImages = [...images];
    newImages[idx] = { ...newImages[idx], [field]: value };
    setImages(newImages);
  };
  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));

  return (
    <form action={async (formData) => {
      setLoading(true);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("flavors", JSON.stringify(flavors));
      formData.append("tiers", JSON.stringify(tiers));
      formData.append("quantityOptions", JSON.stringify(quantityOptions));
      formData.append("images", JSON.stringify(images));
      formData.append("featuredImage", featuredImage);
      formData.append("description", description);
      formData.append("categoryIds", JSON.stringify(categoryIds));
      formData.append("isCustomAssortment", (document.getElementById('isCustomAssortment') as HTMLInputElement)?.checked ? "true" : "false");

      try {
        if (initialData) {
          await updateProduct(initialData.id, formData);
        } else {
          await createProduct(formData);
        }
      } catch (err: any) {
        if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
        console.error(err);
        alert("Something went wrong");
        setLoading(false);
      }
    }} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Basic Info */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Product Name *</label>
          <input type="text" name="name" required defaultValue={initialData?.name}
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Base Price ($) *</label>
          <input type="number" name="price" step="0.01" min="0" required defaultValue={initialData?.price}
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Base Size (e.g. 1 Pound)</label>
          <input type="text" name="baseSize" defaultValue={initialData?.baseSize || ""} placeholder="Leave empty if none"
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Categories *</label>
          <div style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ddd", background: "white", display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
            {categories.map((cat) => (
              <label key={cat.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input 
                  type="checkbox" 
                  checked={categoryIds.includes(cat.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategoryIds([...categoryIds, cat.id]);
                    } else {
                      setCategoryIds(categoryIds.filter(id => id !== cat.id));
                    }
                  }}
                  style={{ width: "1.1rem", height: "1.1rem" }}
                />
                {cat.name}
              </label>
            ))}
          </div>
          {categoryIds.length === 0 && <span style={{ color: "#d32f2f", fontSize: "0.8rem" }}>Please select at least one category.</span>}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Featured Image (Main)</label>
          <ImageUploadInput 
            name="featuredImage" 
            value={featuredImage} 
            onChange={setFeaturedImage} 
            placeholder="https://..." 
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Description *</label>
        <div style={{ background: 'white' }}>
          <ReactQuill 
            // @ts-ignore
            ref={quillRef}
            theme="snow" 
            value={description} 
            onChange={setDescription} 
            modules={modules}
            style={{ height: '250px', marginBottom: '50px' }}
          />
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

      {/* Variations: Sizes & Flavors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Sizes */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Sizes</h3>
            <button type="button" onClick={addSize} style={{ padding: "0.4rem 0.8rem", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>+ Add Size</button>
          </div>
          {sizes.length === 0 ? <p style={{ color: "#888", fontSize: "0.9rem" }}>No sizes added.</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {sizes.map((size, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="text" placeholder="Size Name (e.g. 6 inch)" value={size.name} onChange={(e) => updateSize(i, "name", e.target.value)} required
                    style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.9rem" }} />
                  <input type="number" placeholder="Price ($)" step="0.01" value={size.priceModifier} onChange={(e) => updateSize(i, "priceModifier", parseFloat(e.target.value) || 0)} required
                    style={{ width: "80px", padding: "0.6rem", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.9rem" }} />
                  <button type="button" onClick={() => removeSize(i)} style={{ background: "none", border: "none", color: "#d32f2f", cursor: "pointer", padding: "0 0.5rem" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flavors */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Flavors</h3>
            <button type="button" onClick={addFlavor} style={{ padding: "0.4rem 0.8rem", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>+ Add Flavor</button>
          </div>
          {flavors.length === 0 ? <p style={{ color: "#888", fontSize: "0.9rem" }}>No flavors added.</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {flavors.map((flavor, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="text" placeholder="Flavor (e.g. Vanilla)" value={flavor.name} onChange={(e) => updateFlavor(i, e.target.value)} required
                    style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.9rem" }} />
                  <button type="button" onClick={() => removeFlavor(i)} style={{ background: "none", border: "none", color: "#d32f2f", cursor: "pointer", padding: "0 0.5rem" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Tiered Cakes Configuration */}
      <div style={{ marginTop: "1rem", background: "#fdf8fb", padding: "1.5rem", borderRadius: "12px", border: "1px solid #f8e5f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", margin: 0, color: "#d81b60" }}>Tiered Cakes Configuration</h3>
            <p style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.2rem" }}>Add specific tiers (e.g., Top Tier, Bottom Tier) and assign specific flavors to each.</p>
          </div>
          <button type="button" onClick={addTier} style={{ padding: "0.5rem 1rem", background: "#d81b60", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" }}>+ Add Tier</button>
        </div>
        {tiers.length === 0 ? <p style={{ color: "#888", fontSize: "0.9rem" }}>No tiers configured. (Leave empty if this is not a tiered cake).</p> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {tiers.map((tier, tIdx) => (
              <div key={tIdx} style={{ background: "white", padding: "1rem", borderRadius: "8px", border: "1px solid #ddd" }}>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
                  <input type="text" placeholder="Tier Name (e.g. Top Tier, 6 inch)" value={tier.name} onChange={(e) => updateTierName(tIdx, e.target.value)} required
                    style={{ flex: 1, padding: "0.7rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem", fontWeight: "bold" }} />
                  <button type="button" onClick={() => removeTier(tIdx)} style={{ padding: "0.6rem 1rem", background: "#fff0f0", border: "1px solid #ffcdd2", color: "#d32f2f", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}>Remove Tier</button>
                </div>
                
                <div style={{ paddingLeft: "1.5rem", borderLeft: "3px solid #f8e5f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <h4 style={{ fontSize: "0.95rem", margin: 0 }}>Flavors for {tier.name || `Tier ${tIdx + 1}`}</h4>
                    <button type="button" onClick={() => addTierFlavor(tIdx)} style={{ padding: "0.3rem 0.6rem", background: "#f0f0f0", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem" }}>+ Add Flavor</button>
                  </div>
                  {tier.flavors.length === 0 ? <p style={{ color: "#888", fontSize: "0.8rem", margin: 0 }}>No flavors added. Please add at least one.</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                      {tier.flavors.map((flavor, fIdx) => (
                        <div key={fIdx} style={{ display: "flex", gap: "0.5rem" }}>
                          <input type="text" placeholder="Flavor Name (e.g. Red Velvet)" value={flavor.name} onChange={(e) => updateTierFlavor(tIdx, fIdx, e.target.value)} required
                            style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.85rem" }} />
                          <button type="button" onClick={() => removeTierFlavor(tIdx, fIdx)} style={{ background: "none", border: "none", color: "#d32f2f", cursor: "pointer", padding: "0 0.5rem" }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Quantities */}
      <div style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Custom Quantities / Pack Sizes</h3>
          <button type="button" onClick={addQuantityOption} style={{ padding: "0.4rem 0.8rem", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>+ Add Quantity</button>
        </div>
        {quantityOptions.length === 0 ? <p style={{ color: "#888", fontSize: "0.9rem" }}>No custom quantities added. (e.g., Box of 6, 12 Pack)</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {quantityOptions.map((q, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
                <input type="text" placeholder="e.g. Box of 6" value={q.name} onChange={(e) => updateQuantityOption(i, "name", e.target.value)} required
                  style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.9rem" }} />
                <input type="number" placeholder="Price ($)" step="0.01" value={q.priceModifier} onChange={(e) => updateQuantityOption(i, "priceModifier", parseFloat(e.target.value) || 0)} required
                  style={{ width: "100px", padding: "0.6rem", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.9rem" }} />
                <button type="button" onClick={() => removeQuantityOption(i)} style={{ background: "none", border: "none", color: "#d32f2f", cursor: "pointer", padding: "0 0.5rem" }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

      {/* Images Gallery */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Image Gallery</h3>
          <button type="button" onClick={addImage} style={{ padding: "0.4rem 0.8rem", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>+ Add Image</button>
        </div>
        {images.length === 0 ? <p style={{ color: "#888", fontSize: "0.9rem" }}>No images added.</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {images.map((img, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", background: "#f9f9f9", padding: "1rem", borderRadius: "8px", position: "relative" }}>
                <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "white", border: "1px solid #eee", borderRadius: "50%", width: "24px", height: "24px", color: "#d32f2f", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                <ImageUploadInput 
                  name={`imageUrl_${i}`} 
                  value={img.url} 
                  onChange={(val) => updateImage(i, "url", val)} 
                />
                <input type="text" placeholder="Alt Text (optional)" value={img.altText || ""} onChange={(e) => updateImage(i, "altText", e.target.value)}
                  style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #ddd", fontSize: "0.9rem" }} />
              </div>
            ))}
          </div>
        )}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

      {/* SEO & AEO */}
      <fieldset style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
        <legend style={{ fontWeight: 'bold', padding: '0 0.5rem', fontSize: '1.1rem' }}>SEO & AEO Optimization</legend>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Meta Title (Max 60 chars)</label>
          <input 
            name="metaTitle" 
            type="text" 
            defaultValue={initialData?.metaTitle || ""}
            style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Meta Description (Max 160 chars)</label>
          <textarea 
            name="metaDescription" 
            rows={3}
            defaultValue={initialData?.metaDescription || ""}
            style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }}
          />
        </div>
      </fieldset>

      <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

      {/* Visibility */}
      <div style={{ display: "flex", gap: "2rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <input type="checkbox" name="isFeatured" value="true" defaultChecked={initialData?.isFeatured} style={{ width: "1.1rem", height: "1.1rem" }} />
          <span style={{ fontSize: "0.9rem" }}>⭐ Feature on homepage</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <input type="checkbox" name="isVisible" value="true" defaultChecked={initialData ? initialData.isVisible : true} style={{ width: "1.1rem", height: "1.1rem" }} />
          <span style={{ fontSize: "0.9rem" }}>👁️ Visible in shop</span>
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f0faf9", padding: "1rem", borderRadius: "8px" }}>
          <input type="checkbox" name="isPhotoCake" id="isPhotoCake" value="true" defaultChecked={initialData?.isPhotoCake} style={{ width: "1.2rem", height: "1.2rem", accentColor: "var(--color-primary)" }} />
          <label htmlFor="isPhotoCake" style={{ fontWeight: "600", color: "var(--color-primary)", cursor: "pointer" }}>📸 Enable Photo Cake Upload Option</label>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#fcf4f4", padding: "1rem", borderRadius: "8px" }}>
          <input type="checkbox" name="isCustomAssortment" id="isCustomAssortment" value="true" defaultChecked={initialData?.isCustomAssortment} style={{ width: "1.2rem", height: "1.2rem", accentColor: "#d32f2f" }} />
          <label htmlFor="isCustomAssortment" style={{ fontWeight: "600", color: "#d32f2f", cursor: "pointer" }}>🧁 Enable Custom Flavor Assortment (Build a Box)</label>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#fff5e6", padding: "1rem", borderRadius: "8px" }}>
          <input type="checkbox" name="isPickupAvailable" id="isPickupAvailable" value="true" defaultChecked={initialData ? initialData.isPickupAvailable : true} style={{ width: "1.2rem", height: "1.2rem", accentColor: "var(--color-secondary)" }} />
          <label htmlFor="isPickupAvailable" style={{ fontWeight: "600", color: "var(--color-secondary)", cursor: "pointer" }}>🏬 Pickup Available</label>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", paddingTop: "1rem" }}>
        <Link href="/dashboard/products" style={{ padding: "0.7rem 1.5rem", border: "1px solid #ddd", borderRadius: "8px", color: "#555", textDecoration: "none", fontSize: "0.9rem" }}>Cancel</Link>
        <button type="submit" disabled={loading} style={{ padding: "0.7rem 1.8rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: loading ? "wait" : "pointer", fontSize: "0.9rem" }}>
          {loading ? "Saving..." : initialData ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
