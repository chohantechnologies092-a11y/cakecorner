import { prisma } from "@/lib/db"; 
import { revalidatePath } from "next/cache";

export default async function HomepageSettingsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  async function updateSettings(formData: FormData) {
    "use server";
    
    // Reset all flags
    await prisma.category.updateMany({
      data: { isFeaturedOnHome: false, showAsProductRow: false }
    });

    const categoryIds = formData.getAll("categoryIds");
    for (const id of categoryIds) {
      const isFeatured = formData.get(`featured_${id}`) === "on";
      const isRow = formData.get(`row_${id}`) === "on";
      const rowOrder = parseInt(formData.get(`order_${id}`) as string) || 0;

      await prisma.category.update({
        where: { id: id as string },
        data: {
          isFeaturedOnHome: isFeatured,
          showAsProductRow: isRow,
          productRowOrder: rowOrder,
        }
      });
    }

    revalidatePath("/dashboard/homepage");
    revalidatePath("/");
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Homepage Management</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Select which categories appear on the homepage. 
        "Featured Grid" shows in the circular bubbles at the top. 
        "Product Row" shows a scrollable horizontal row of products for that category further down the page.
      </p>

      <form action={updateSettings} style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
              <th style={{ padding: "1rem", fontWeight: "600" }}>Category Name</th>
              <th style={{ padding: "1rem", fontWeight: "600", textAlign: "center" }}>Featured Grid (Top)</th>
              <th style={{ padding: "1rem", fontWeight: "600", textAlign: "center" }}>Product Row</th>
              <th style={{ padding: "1rem", fontWeight: "600" }}>Row Order</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "1rem", fontWeight: "500" }}>
                  <input type="hidden" name="categoryIds" value={cat.id} />
                  {cat.name}
                </td>
                <td style={{ padding: "1rem", textAlign: "center" }}>
                  <input type="checkbox" name={`featured_${cat.id}`} defaultChecked={cat.isFeaturedOnHome} style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }} />
                </td>
                <td style={{ padding: "1rem", textAlign: "center" }}>
                  <input type="checkbox" name={`row_${cat.id}`} defaultChecked={cat.showAsProductRow} style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }} />
                </td>
                <td style={{ padding: "1rem" }}>
                  <input type="number" name={`order_${cat.id}`} defaultValue={cat.productRowOrder} style={{ width: "80px", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" style={{ padding: "0.8rem 2rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "1rem" }}>
            Save Homepage Settings
          </button>
        </div>
      </form>
    </div>
  );
}
