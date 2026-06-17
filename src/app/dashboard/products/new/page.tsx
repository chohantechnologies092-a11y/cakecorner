import { createProduct } from "@/lib/actions";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "../../page.module.css";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  if (categories.length === 0) {
    redirect("/dashboard/categories/new");
  }
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Add New Product</h1>
        <p style={{ color: "#666" }}>Create a new product with sizes, flavors, and images.</p>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
