import { prisma } from "@/lib/db";
import { notFound } from "next/navigation"; 
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { sizes: true, flavors: true, images: true }
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Edit Product</h1>
        <p style={{ color: "#666" }}>Update product details, sizes, flavors, and images.</p>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <ProductForm categories={categories} initialData={product} />
      </div>
    </div>
  );
}
