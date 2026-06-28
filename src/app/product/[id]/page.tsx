import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import ProductDetails from "@/components/shop/ProductDetails";
import { stripHtml } from "@/lib/utils";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await props.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true }
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.metaTitle || `${product.name} | Cake Shop`,
    description: product.metaDescription || stripHtml(product.description).slice(0, 150),
    alternates: {
      canonical: product.canonicalUrl || `/product/${product.id}`,
    },
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || stripHtml(product.description).slice(0, 150) || undefined,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      categories: true,
      sizes: true,
      flavors: true,
      quantityOptions: true,
      images: true,
    }
  });

  const storeSetting = await prisma.storeSetting.findUnique({ where: { id: "global" } });
  const pickupLocation = storeSetting?.pickupLocation || "145 Ladypool Road, Birmingham";

  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.metaDescription || stripHtml(product.description),
    image: product.imageUrl ? [product.imageUrl] : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'GBP',
      availability: product.isVisible ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: product.canonicalUrl || `http://localhost:3000/product/${product.id}`,
    },
  };

  const relatedProducts = await prisma.product.findMany({
    where: {
      categories: { some: { id: { in: product.categories.map((c: any) => c.id) } } },
      id: { not: product.id },
      isVisible: true,
    },
    include: { categories: true, sizes: true, flavors: true },
    take: 4,
  });

  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "8rem 1.5rem 4rem" }}>
        <ProductDetails product={product} pickupLocation={pickupLocation} />

        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "6rem", borderTop: "1px solid #eee", paddingTop: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)", textAlign: "center", marginBottom: "3rem" }}>
              Related Products
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
              {relatedProducts.map((rp) => (
                <div key={rp.id} style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                  <div style={{ width: "100%", height: "220px", position: "relative" }}>
                    {rp.imageUrl ? (
                      <img src={rp.imageUrl} alt={rp.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🎂</div>
                    )}
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--color-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>
                      {rp.categories.map((c: any) => c.name).join(', ')}
                    </span>
                    <h3 style={{ fontSize: "1.3rem", margin: "0 0 0.5rem 0", color: "#333", fontFamily: "var(--font-heading)" }}>{rp.name}</h3>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-primary)", marginTop: "auto", paddingTop: "1rem" }}>
                      £{rp.price.toFixed(2)}
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                      <a 
                        href={`/product/${rp.id}`} 
                        style={{ display: "block", textAlign: "center", padding: "0.8rem", background: "var(--color-primary)", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
