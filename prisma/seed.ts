import { AdminRole, PrismaClient, Prisma } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface RawProduct {
  categoryId: string;
  nameAr: string;
  nameEn: string;
  description: string;
  price: number;
  oldPrice?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  imageUrl: string;
}

const CATEGORIES = [
  {
    id: 'cat-coffee',
    nameAr: 'قهوة مختصة',
    nameEn: 'Specialty Coffee',
    description: 'أجود أنواع البن المحمص بعناية',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    sortOrder: 1,
  },
  {
    id: 'cat-cold-drinks',
    nameAr: 'مشروبات باردة',
    nameEn: 'Cold Drinks',
    description: 'انتعاش يدوم طويلاً',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80',
    sortOrder: 2,
  },
  {
    id: 'cat-sweets',
    nameAr: 'حلويات فاخرة',
    nameEn: 'Premium Sweets',
    description: 'حلويات عالمية بلمسة خاصة',
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&q=80',
    sortOrder: 3,
  },
  {
    id: 'cat-pastries',
    nameAr: 'مخبوزات ومعجنات',
    nameEn: 'Bakery & Pastries',
    description: 'طازجة من الفرن يومياً',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
    sortOrder: 4,
  },
  {
    id: 'cat-offers',
    nameAr: 'عروض وباقات',
    nameEn: 'Offers & Bundles',
    description: 'باقات هدايا وعروض توفيرية',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80',
    sortOrder: 5,
  },
];

async function main() {
  console.log('Start clean seeding...');

  // Reset database (optional but recommended for "CLEAN SEED")
  // Note: Depending on your foreign keys, order of deletion matters.
  await prisma.adminUser.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productAddon.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. Seed Categories
  for (const cat of CATEGORIES) {
    await prisma.category.create({
      data: cat,
    });
  }
  console.log('Categories seeded.');

  // 1.1 Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sweetcafe.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      name: 'Super Admin',
      email: adminEmail,
      passwordHash,
      role: AdminRole.ADMIN,
      isActive: true,
    },
  });
  console.log(`Admin user seeded: ${adminEmail}`);

  // 1.2 Seed Default Delivery Zone
  const defaultZone = await prisma.deliveryZone.upsert({
    where: { id: 'default-zone-id' },
    update: {
      minOrderAmount: new Prisma.Decimal(10),
    },
    create: {
      id: 'default-zone-id',
      nameAr: 'جميع المناطق',
      nameEn: 'All Areas',
      description: 'منطقة التوصيل الافتراضية',
      deliveryFee: new Prisma.Decimal(10),
      minOrderAmount: new Prisma.Decimal(10),
      estimatedMinutes: 30,
      polygon: {},
      isActive: true,
    },
  });
  console.log('Default delivery zone seeded.');

  // 1.3 Seed App Settings
  const settings = [
    { key: 'whatsapp_number', value: '966500000000' },
    { key: 'store_name', value: 'Kafi Bun' },
    { key: 'is_open', value: 'true' },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('App settings seeded.');

  // 2. Load Products from JSON
  const dataPath = join(__dirname, '..', 'داتا ست.json');
  const fileContent = readFileSync(dataPath, 'utf8');
  
  // The file contains multiple JSON arrays and comments.
  // We'll strip comments and extract all arrays.
  const cleanContent = fileContent.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
  
  // Extract all occurrences of [...]
  const arrayRegex = /\[[\s\S]*?\]/g;
  const matches = cleanContent.match(arrayRegex);
  
  let allProducts: RawProduct[] = [];
  if (matches) {
    for (const match of matches) {
      try {
        const products = JSON.parse(match);
        if (Array.isArray(products)) {
          allProducts = allProducts.concat(products);
        }
      } catch (e) {
        console.error('Error parsing JSON block:', e);
      }
    }
  }

  console.log(`Found ${allProducts.length} products to seed.`);

  // 3. Seed Products
  for (const [index, p] of allProducts.entries()) {
    const productId = generateId(p.nameEn, index);
    const basePrice = new Prisma.Decimal(p.price);
    const oldPrice = p.oldPrice ? new Prisma.Decimal(p.oldPrice) : new Prisma.Decimal(0);

    // Strict Mapping Logic:
    let description = p.description;
    if (p.categoryId === 'cat-offers') {
      description = `[Bundle/Gift] ${description}`;
    }
    if (p.oldPrice) {
      const discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
      description = `Today's Offer (${discount}% OFF)! ${description}`;
    }

    await prisma.product.create({
      data: {
        id: productId,
        categoryId: p.categoryId,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        description: description,
        price: basePrice,
        oldPrice: oldPrice,
        imageUrl: p.imageUrl,
        isActive: true,
        isAvailable: true,
        isFeatured: p.isFeatured || false,
        isBestSeller: p.isBestSeller || false,
        sortOrder: index,
        // Optional: Default sizes for beverages
        sizes: (p.categoryId === 'cat-coffee' || p.categoryId === 'cat-cold-drinks') ? {
          create: [
            { name: 'Small', price: basePrice, isDefault: true },
            { name: 'Medium', price: basePrice.add(3), isDefault: false },
            { name: 'Large', price: basePrice.add(6), isDefault: false },
          ]
        } : undefined,
      },
    });
  }

  console.log(`Seeded ${allProducts.length} products.`);
  console.log('Seeding finished.');
}

function generateId(name: string, index: number): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `prod-${slug}-${index}`;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
