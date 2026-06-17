import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function MegaMenuSettingsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  async function updateSettings(formData: FormData) {
    "use server";
    
    // Reset all flags
    await prisma.category.updateMany({
      data: { showInMegaMenu: false }
    });

    const categoryIds = formData.getAll("categoryIds");
    for (const id of categoryIds) {
      const isMega = formData.get(`mega_${id}`) === "on";

      if (isMega) {
        await prisma.category.update({
          where: { id: id as string },
          data: { showInMegaMenu: true }
        });
      }
    }

    revalidatePath("/dashboard/mega-menu");
    revalidatePath("/");
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Mega Menu Settings</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Select which categories should appear inside the "Cakes" mega menu dropdown in the top navigation bar.
      </p>

      <form action={updateSettings} style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
              <th style={{ padding: "1rem", fontWeight: "600" }}>Category Name</th>
              <th style={{ padding: "1rem", fontWeight: "600", textAlign: "center" }}>Show in Mega Menu</th>
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
                  <input type="checkbox" name={`mega_${cat.id}`} defaultChecked={cat.showInMegaMenu} style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" style={{ padding: "0.8rem 2rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "1rem" }}>
            Save Mega Menu Settings
          </button>
        </div>
      </form>
    </div>
  );
}
