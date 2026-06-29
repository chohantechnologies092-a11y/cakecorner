import { prisma } from "@/lib/db";
import { updateStoreSettings } from "@/lib/actions";
import ResetAnalyticsButton from "@/components/admin/ResetAnalyticsButton";

export default async function SettingsPage() {
  const storeSetting = await prisma.storeSetting.findUnique({ where: { id: "global" } });
  
  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontFamily: "var(--font-heading)" }}>Store Settings</h1>
      
      <div style={{ background: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", maxWidth: "600px" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>Pickup Settings</h2>
        
        <form action={updateStoreSettings} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: "600", fontSize: "0.95rem" }}>Store Pickup Location</label>
            <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>This location will be shown to customers when they click on "Pickup Available".</p>
            <textarea 
              name="pickupLocation" 
              required 
              rows={4}
              defaultValue={storeSetting?.pickupLocation || "145 Ladypool Road, Birmingham"} 
              style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem", fontFamily: "inherit" }} 
            />
          </div>
          
          <button type="submit" style={{ background: "var(--color-primary)", color: "white", padding: "0.8rem", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}>
            Save Settings
          </button>
        </form>
      </div>

      <div style={{ background: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", maxWidth: "600px", marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "#d32f2f" }}>Danger Zone</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
          <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>
            Resetting analytics will permanently delete all page views, visitor counts, and location data. This action cannot be undone.
          </p>
          <ResetAnalyticsButton />
        </div>
      </div>
    </div>
  );
}
