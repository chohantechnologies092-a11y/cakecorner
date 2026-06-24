"use server"; 

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  const session = await auth();
  if (session?.user?.role === "EMPLOYEE") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const imageUrl = formData.get("imageUrl") as string | null;
  const isVisible = formData.get("isVisible") === "true";
  const isFeaturedOnHome = formData.get("isFeaturedOnHome") === "true";
  const description = formData.get("description") as string | null;

  if (!name) throw new Error("Category name is required.");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const count = await prisma.category.count();

  await prisma.category.create({
    data: { name, slug, description: description || null, imageUrl: imageUrl || null, isVisible, isFeaturedOnHome, sortOrder: count },
  });

  revalidatePath("/dashboard/categories");
  revalidatePath("/");
  redirect("/dashboard/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role === "EMPLOYEE") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const imageUrl = formData.get("imageUrl") as string | null;
  const isVisible = formData.get("isVisible") === "true";
  const isFeaturedOnHome = formData.get("isFeaturedOnHome") === "true";
  const description = formData.get("description") as string | null;

  if (!name) throw new Error("Category name is required.");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  await prisma.category.update({
    where: { id },
    data: { name, slug, description: description || null, imageUrl: imageUrl || null, isVisible, isFeaturedOnHome },
  });

  revalidatePath("/dashboard/categories");
  revalidatePath("/");
  redirect("/dashboard/categories");
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (session?.user?.role === "EMPLOYEE") throw new Error("Unauthorized");

  await prisma.category.delete({ where: { id } });
  revalidatePath("/dashboard/categories");
  revalidatePath("/");
}

// ─────────────────────────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────────────────────────

export async function getAccessories() {
  const accessories = await prisma.product.findMany({
    where: {
      isVisible: true,
      category: {
        name: {
          contains: "Accessor", // matches Accessories or Accessory
        }
      }
    },
    take: 4,
    include: {
      category: true,
      sizes: true,
      flavors: true,
    }
  });
  return accessories;
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceStr = formData.get("price") as string;
  const categoryId = formData.get("categoryId") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  const isVisible = formData.get("isVisible") !== "false";
  const isPhotoCake = formData.get("isPhotoCake") === "true";
  
  const sizesStr = formData.get("sizes") as string;
  const flavorsStr = formData.get("flavors") as string;
  const imagesStr = formData.get("images") as string;
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;

  if (!name || !description || !priceStr || !categoryId) {
    throw new Error("Name, description, price, and category are required.");
  }

  const sizes = sizesStr ? JSON.parse(sizesStr) : [];
  const flavors = flavorsStr ? JSON.parse(flavorsStr) : [];
  const images = imagesStr ? JSON.parse(imagesStr) : [];
  
  const quantityOptionsStr = formData.get("quantityOptions") as string;
  const quantityOptions = quantityOptionsStr ? JSON.parse(quantityOptionsStr) : [];
  
  let featuredImageUrl = formData.get("featuredImage") as string;
  if (!featuredImageUrl && images.length > 0) {
    featuredImageUrl = images[0].url;
  }

  await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(priceStr),
      categoryId,
      imageUrl: featuredImageUrl || null,
      isFeatured,
      isVisible,
      isPhotoCake,
      isPickupAvailable: formData.get("isPickupAvailable") === "true",
      baseSize: formData.get("baseSize") as string || null,
      metaTitle,
      metaDescription,
      sizes: { create: sizes.map((s: any) => ({ name: s.name, priceModifier: s.priceModifier })) },
      flavors: { create: flavors.map((f: any) => ({ name: f.name })) },
      quantityOptions: { create: quantityOptions.map((q: any) => ({ name: q.name, priceModifier: q.priceModifier })) },
      images: { create: images.map((i: any) => ({ url: i.url, altText: i.altText })) },
    },
  });

  revalidatePath("/dashboard/products");
  revalidatePath("/");
  redirect("/dashboard/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceStr = formData.get("price") as string;
  const categoryId = formData.get("categoryId") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  const isVisible = formData.get("isVisible") !== "false";
  const isPhotoCake = formData.get("isPhotoCake") === "true";

  const sizesStr = formData.get("sizes") as string;
  const flavorsStr = formData.get("flavors") as string;
  const imagesStr = formData.get("images") as string;
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;

  if (!name || !description || !priceStr || !categoryId) {
    throw new Error("Name, description, price, and category are required.");
  }

  const sizes = sizesStr ? JSON.parse(sizesStr) : [];
  const flavors = flavorsStr ? JSON.parse(flavorsStr) : [];
  const images = imagesStr ? JSON.parse(imagesStr) : [];
  
  const quantityOptionsStr = formData.get("quantityOptions") as string;
  const quantityOptions = quantityOptionsStr ? JSON.parse(quantityOptionsStr) : [];
  
  let featuredImageUrl = formData.get("featuredImage") as string;
  if (!featuredImageUrl && images.length > 0) {
    featuredImageUrl = images[0].url;
  }

  // For updates, we delete existing relations and recreate them for simplicity
  await prisma.productSize.deleteMany({ where: { productId: id } });
  await prisma.productFlavor.deleteMany({ where: { productId: id } });
  await prisma.productQuantityOption.deleteMany({ where: { productId: id } });
  await prisma.productImage.deleteMany({ where: { productId: id } });

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price: parseFloat(priceStr),
      categoryId,
      imageUrl: featuredImageUrl || null,
      isFeatured,
      isVisible,
      isPhotoCake,
      isPickupAvailable: formData.get("isPickupAvailable") === "true",
      baseSize: formData.get("baseSize") as string || null,
      metaTitle,
      metaDescription,
      sizes: { create: sizes.map((s: any) => ({ name: s.name, priceModifier: s.priceModifier })) },
      flavors: { create: flavors.map((f: any) => ({ name: f.name })) },
      quantityOptions: { create: quantityOptions.map((q: any) => ({ name: q.name, priceModifier: q.priceModifier })) },
      images: { create: images.map((i: any) => ({ url: i.url, altText: i.altText })) },
    },
  });

  revalidatePath("/dashboard/products");
  revalidatePath("/");
  redirect("/dashboard/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/dashboard/products");
  revalidatePath("/");
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  await prisma.product.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/dashboard/products");
  revalidatePath("/");
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────────────────────────────────────

export async function createOrder(data: {
  customer: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  deliveryFee?: number;
  paymentMethod?: string;
  items: { productId: string; quantity: number; price: number; size?: string | null; flavor?: string | null; quantityOption?: string | null; photoUrl?: string | null }[];
}) {
  try {
    let total = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    if (data.deliveryFee) {
      total += data.deliveryFee;
    }

    // Verify all products still exist (handles stale carts after DB re-seeds)
    const productIds = data.items.map(i => i.productId);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true }
    });
    
    if (existingProducts.length !== productIds.length) {
      throw new Error("One or more items in your cart are no longer available. Please clear your cart and add them again.");
    }

    const order = await prisma.order.create({
      data: {
        customer: data.customer,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        total,
        paymentMethod: data.paymentMethod || "Cash",
        paymentStatus: "Pending",
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
            size: i.size,
            flavor: i.flavor,
            quantityOption: i.quantityOption,
            photoUrl: i.photoUrl,
          })),
        },
      },
    });

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard");
    return order;
  } catch (error: any) {
    console.error("Failed to create order:", error);
    throw new Error(error.message || "Failed to create order");
  }
}

export async function updateOrderStatus(id: string, status: string) {
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${id}`);
  revalidatePath("/dashboard");
}

export async function deleteOrder(id: string) {
  const session = await auth();
  // Optional: Restrict deletion to SUPER_ADMIN or ADMIN. 
  // Let's restrict it to SUPER_ADMIN so employees don't delete orders accidentally.
  if (session?.user?.role === "EMPLOYEE") throw new Error("Unauthorized");
  
  await prisma.order.delete({ where: { id } });
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav Menu
// ─────────────────────────────────────────────────────────────────────────────

export async function createNavItem(formData: FormData) {
  const session = await auth();
  if (session?.user?.role === "EMPLOYEE") throw new Error("Unauthorized");

  const label = formData.get("label") as string;
  const url = formData.get("url") as string;
  const openNewTab = formData.get("openNewTab") === "true";
  const isVisible = formData.get("isVisible") !== "false";

  if (!label || !url) throw new Error("Label and URL are required.");

  const count = await prisma.navMenuItem.count();

  await prisma.navMenuItem.create({
    data: { label, url, openNewTab, isVisible, sortOrder: count },
  });

  revalidatePath("/dashboard/nav-menu");
  revalidatePath("/");
  redirect("/dashboard/nav-menu");
}

export async function updateNavItem(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role === "EMPLOYEE") throw new Error("Unauthorized");

  const label = formData.get("label") as string;
  const url = formData.get("url") as string;
  const openNewTab = formData.get("openNewTab") === "true";
  const isVisible = formData.get("isVisible") !== "false";

  if (!label || !url) throw new Error("Label and URL are required.");

  await prisma.navMenuItem.update({
    where: { id },
    data: { label, url, openNewTab, isVisible },
  });

  revalidatePath("/dashboard/nav-menu");
  revalidatePath("/");
  redirect("/dashboard/nav-menu");
}

export async function deleteNavItem(id: string) {
  const session = await auth();
  if (session?.user?.role === "EMPLOYEE") throw new Error("Unauthorized");

  await prisma.navMenuItem.delete({ where: { id } });
  revalidatePath("/dashboard/nav-menu");
  revalidatePath("/");
}

export async function seedDefaultNavItems() {
  const count = await prisma.navMenuItem.count();
  if (count > 0) return;

  await prisma.navMenuItem.createMany({
    data: [
      { label: "Home", url: "/", sortOrder: 0, isVisible: true },
      { label: "Cakes", url: "/shop", sortOrder: 1, isVisible: true },
      { label: "Blog", url: "/blog", sortOrder: 2, isVisible: true },
      { label: "Contact", url: "/contact", sortOrder: 3, isVisible: true },
    ],
  });
}
export async function updateStoreSettings(formData: FormData) {
  const pickupLocation = formData.get("pickupLocation") as string;
  
  if (!pickupLocation) {
    throw new Error("Pickup location is required");
  }
  
  await prisma.storeSetting.upsert({
    where: { id: "global" },
    update: { pickupLocation },
    create: { id: "global", pickupLocation }
  });
  
  revalidatePath("/");
  revalidatePath("/product/[id]", "page");
  revalidatePath("/dashboard/settings");
}
