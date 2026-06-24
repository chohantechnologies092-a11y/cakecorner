const { PrismaClient } = require('@prisma/client');
const Database = require('better-sqlite3');

const prisma = new PrismaClient();
const db = new Database('prisma/dev.db');

async function migrate() {
  console.log("Cleaning Postgres database...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productFlavor.deleteMany({});
  await prisma.productSize.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.navMenuItem.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.blogCategory.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.storeSetting.deleteMany({});
  console.log("Database cleaned.");

  console.log("Starting migration from SQLite to Postgres...");
  
  // 1. Users
  const users = db.prepare('SELECT * FROM User').all();
  if (users.length > 0) {
    users.forEach(u => {
      if (u.createdAt) u.createdAt = new Date(u.createdAt);
      if (u.updatedAt) u.updatedAt = new Date(u.updatedAt);
    });
    await prisma.user.createMany({ data: users, skipDuplicates: true });
    console.log(`Migrated ${users.length} Users.`);
  }

  // 2. Categories
  const categories = db.prepare('SELECT * FROM Category').all();
  if (categories.length > 0) {
    categories.forEach(c => {
      if (c.createdAt) c.createdAt = new Date(c.createdAt);
      if (c.updatedAt) c.updatedAt = new Date(c.updatedAt);
      c.isVisible = Boolean(c.isVisible);
      c.isFeaturedOnHome = Boolean(c.isFeaturedOnHome);
      c.showAsProductRow = Boolean(c.showAsProductRow);
      c.showInMegaMenu = Boolean(c.showInMegaMenu);
    });
    await prisma.category.createMany({ data: categories, skipDuplicates: true });
    console.log(`Migrated ${categories.length} Categories.`);
  }

  // 3. Products
  const products = db.prepare('SELECT * FROM Product').all();
  if (products.length > 0) {
    products.forEach(p => {
      if (p.createdAt) p.createdAt = new Date(p.createdAt);
      if (p.updatedAt) p.updatedAt = new Date(p.updatedAt);
      p.isFeatured = Boolean(p.isFeatured);
      p.isVisible = Boolean(p.isVisible);
      p.isPhotoCake = Boolean(p.isPhotoCake);
      p.isPickupAvailable = Boolean(p.isPickupAvailable);
    });
    await prisma.product.createMany({ data: products, skipDuplicates: true });
    console.log(`Migrated ${products.length} Products.`);
  }

  // 4. ProductSizes
  const productSizes = db.prepare('SELECT * FROM ProductSize').all();
  if (productSizes.length > 0) {
    await prisma.productSize.createMany({ data: productSizes, skipDuplicates: true });
    console.log(`Migrated ${productSizes.length} ProductSizes.`);
  }

  // 5. ProductFlavors
  const productFlavors = db.prepare('SELECT * FROM ProductFlavor').all();
  if (productFlavors.length > 0) {
    await prisma.productFlavor.createMany({ data: productFlavors, skipDuplicates: true });
    console.log(`Migrated ${productFlavors.length} ProductFlavors.`);
  }

  // 6. ProductImages
  const productImages = db.prepare('SELECT * FROM ProductImage').all();
  if (productImages.length > 0) {
    await prisma.productImage.createMany({ data: productImages, skipDuplicates: true });
    console.log(`Migrated ${productImages.length} ProductImages.`);
  }

  // 7. BlogCategories
  const blogCategories = db.prepare('SELECT * FROM BlogCategory').all();
  if (blogCategories.length > 0) {
    blogCategories.forEach(c => {
      if (c.createdAt) c.createdAt = new Date(c.createdAt);
      if (c.updatedAt) c.updatedAt = new Date(c.updatedAt);
    });
    await prisma.blogCategory.createMany({ data: blogCategories, skipDuplicates: true });
    console.log(`Migrated ${blogCategories.length} BlogCategories.`);
  }

  // 8. BlogPosts
  const blogPosts = db.prepare('SELECT * FROM BlogPost').all();
  if (blogPosts.length > 0) {
    blogPosts.forEach(p => {
      if (p.createdAt) p.createdAt = new Date(p.createdAt);
      if (p.updatedAt) p.updatedAt = new Date(p.updatedAt);
      p.isPublished = Boolean(p.isPublished);
      if (p.publishedAt) p.publishedAt = new Date(p.publishedAt);
    });
    await prisma.blogPost.createMany({ data: blogPosts, skipDuplicates: true });
    console.log(`Migrated ${blogPosts.length} BlogPosts.`);
  }

  // 9. NavMenuItems
  const navMenuItems = db.prepare('SELECT * FROM NavMenuItem').all();
  if (navMenuItems.length > 0) {
    navMenuItems.forEach(n => {
      if (n.createdAt) n.createdAt = new Date(n.createdAt);
      if (n.updatedAt) n.updatedAt = new Date(n.updatedAt);
      n.isVisible = Boolean(n.isVisible);
      n.openNewTab = Boolean(n.openNewTab);
    });
    await prisma.navMenuItem.createMany({ data: navMenuItems, skipDuplicates: true });
    console.log(`Migrated ${navMenuItems.length} NavMenuItems.`);
  }

  // 10. StoreSettings
  const storeSettings = db.prepare('SELECT * FROM StoreSetting').all();
  if (storeSettings.length > 0) {
    storeSettings.forEach(s => {
      if (s.updatedAt) s.updatedAt = new Date(s.updatedAt);
    });
    await prisma.storeSetting.createMany({ data: storeSettings, skipDuplicates: true });
    console.log(`Migrated ${storeSettings.length} StoreSettings.`);
  }

  // 11. Orders
  const orders = db.prepare('SELECT * FROM "Order"').all();
  if (orders.length > 0) {
    orders.forEach(o => {
      if (o.createdAt) o.createdAt = new Date(o.createdAt);
      if (o.updatedAt) o.updatedAt = new Date(o.updatedAt);
    });
    await prisma.order.createMany({ data: orders, skipDuplicates: true });
    console.log(`Migrated ${orders.length} Orders.`);
  }

  // 12. OrderItems
  const orderItems = db.prepare('SELECT * FROM OrderItem').all();
  if (orderItems.length > 0) {
    await prisma.orderItem.createMany({ data: orderItems, skipDuplicates: true });
    console.log(`Migrated ${orderItems.length} OrderItems.`);
  }

  console.log("Migration completed perfectly!");
}

migrate()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    db.close();
  });
