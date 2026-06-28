import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({ categories: [], products: [] });
    }

    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        where: {
          isVisible: true,
          name: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
        },
      }),
      prisma.product.findMany({
        where: {
          isVisible: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 8,
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          categories: { select: { slug: true, name: true } },
        },
      }),
    ]);

    return NextResponse.json({ categories, products });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
  }
}
