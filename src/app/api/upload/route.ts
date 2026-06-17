import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a unique filename
    const ext = path.extname(file.name) || ".jpg";
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const filename = `${uniqueId}${ext}`;

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
