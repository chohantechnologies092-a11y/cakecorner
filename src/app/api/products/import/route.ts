import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const products = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of rows." }, { status: 400 });
    }

    let importedCount = 0;
    const errors: string[] = [];

    for (const [index, row] of products.entries()) {
      // Handle standard Shopify CSV headers
      const title = row['Title'];
      const description = row['Body (HTML)'] || '';
      const priceStr = row['Variant Price'];
      const typeStr = row['Type'] || 'Uncategorized';
      const imageSrc = row['Image Src'];
      const isPublished = row['Published'] !== 'FALSE';
      
      // SEO Fields
      const metaTitle = row['SEO Title'] || null;
      const metaDescription = row['SEO Description'] || null;

      // Skip rows without title (e.g., secondary variants in Shopify CSV)
      if (!title) {
        continue;
      }

      const price = parseFloat(priceStr);
      if (isNaN(price)) {
        errors.push(`Row ${index + 2}: Invalid price for product '${title}'`);
        continue;
      }

      // 1. Find or Create Category
      // Note: SQLite is case-sensitive with string equals, but we will search case-insensitive if possible, 
      // or just search exact and fallback to creating.
      let category = await prisma.category.findFirst({
        where: { name: typeStr }
      });

      if (!category) {
        // Create a unique slug for the category
        let baseSlug = typeStr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        if (!baseSlug) baseSlug = 'category';
        
        // Ensure unique slug
        const uniqueSlug = `${baseSlug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        category = await prisma.category.create({
          data: {
            name: typeStr,
            slug: uniqueSlug,
            isVisible: true,
          }
        });
      }

      // 2. Download and save the image locally
      let finalImageUrl = imageSrc || null;

      if (imageSrc && imageSrc.startsWith('http')) {
        try {
          const imageRes = await fetch(imageSrc);
          if (imageRes.ok) {
            const buffer = Buffer.from(await imageRes.arrayBuffer());
            
            // Extract extension or default to .jpg
            let ext = ".jpg";
            try {
              const pathname = new URL(imageSrc).pathname;
              const parsedExt = path.extname(pathname);
              if (parsedExt) ext = parsedExt;
            } catch (e) {
              // ignore url parse error
            }

            const uniqueId = crypto.randomBytes(8).toString("hex");
            const filename = `import-${uniqueId}${ext}`;
            const uploadsDir = path.join(process.cwd(), "public", "uploads");
            
            await fs.mkdir(uploadsDir, { recursive: true });
            const filePath = path.join(uploadsDir, filename);
            await fs.writeFile(filePath, buffer);
            
            finalImageUrl = `/uploads/${filename}`;
          }
        } catch (e) {
          console.error("Failed to download image:", imageSrc, e);
          // Keep the original URL as a fallback
        }
      }

      // 3. Create the Product
      await prisma.product.create({
        data: {
          name: title,
          description: description,
          price: price,
          imageUrl: finalImageUrl,
          isVisible: isPublished,
          categories: { connect: [{ id: category.id }] },
          metaTitle: metaTitle,
          metaDescription: metaDescription,
        }
      });

      importedCount++;
    }

    return NextResponse.json({ 
      message: `Successfully imported ${importedCount} products`, 
      count: importedCount,
      errors: errors.length > 0 ? errors : undefined
    }, { status: 200 });

  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred during import." }, { status: 500 });
  }
}
