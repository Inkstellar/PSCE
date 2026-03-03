import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Get current date info
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@purpleskull.com' },
    update: {},
    create: {
      email: 'admin@purpleskull.com',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✓ Created admin user: ${admin.email}`);

  // Create sample regular users
  const users = [
    {
      email: 'john@example.com',
      name: 'John Doe',
      password: await bcrypt.hash('password123', 10),
    },
    {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: await bcrypt.hash('password123', 10),
    },
    {
      email: 'mike@example.com',
      name: 'Mike Johnson',
      password: await bcrypt.hash('password123', 10),
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        role: Role.USER,
      },
    });
    console.log(`✓ Created user: ${user.email}`);
  }

  // Create banners
  const banners = [
    {
      title: "New Arrivals This Week",
      subtitle: "Discover the latest releases from top publishers",
      imageUrl: "/images/banner1.png",
      order: 1,
      active: true,
    },
    {
      title: "Collector's Edition",
      subtitle: "Limited edition variants and exclusive covers",
      imageUrl: "/images/banner2.png",
      order: 2,
      active: true,
    },
    {
      title: "Membership Perks",
      subtitle: "Join our loyalty program for exclusive discounts",
      imageUrl: "/images/banner3.png",
      order: 3,
      active: true,
    },
  ];

  for (const banner of banners) {
    await prisma.banner.upsert({
      where: { id: `banner-${banner.order}` },
      update: banner,
      create: { id: `banner-${banner.order}`, ...banner },
    });
    console.log(`✓ Created banner: ${banner.title}`);
  }

  // Create sample books with INR prices
  const books = [
    {
      name: "The Dark Knight Returns",
      description: "Batman comes out of retirement to fight crime in a futuristic Gotham. A landmark graphic novel.",
      author: "Frank Miller",
      price: 1499,
      coverImage: "/images/banner1.png",
      publishedAt: new Date(currentYear, currentMonth, 1),
      stock: 25,
      isbn: "978-1563893421",
      pages: 224,
    },
    {
      name: "Spider-Man: Blue",
      description: "A touching love story between Peter Parker and Gwen Stacy, told through Valentine's Day memories.",
      author: "Jeph Loeb & Tim Sale",
      price: 1799,
      coverImage: "/images/banner2.png",
      publishedAt: new Date(currentYear, currentMonth, 5),
      stock: 15,
      isbn: "978-0785110864",
      pages: 168,
    },
    {
      name: "Saga Vol. 1",
      description: "An epic space opera following two lovers from warring alien races and their newborn daughter.",
      author: "Brian K. Vaughan",
      price: 899,
      coverImage: "/images/banner3.png",
      publishedAt: new Date(currentYear, currentMonth, 8),
      stock: 30,
      isbn: "978-1607066019",
      pages: 160,
    },
    {
      name: "Watchmen",
      description: "A groundbreaking deconstruction of the superhero genre in an alternate 1985 America.",
      author: "Alan Moore",
      price: 2299,
      coverImage: "/images/banner1.png",
      publishedAt: new Date(currentYear, currentMonth, 12),
      stock: 20,
      isbn: "978-0930289232",
      pages: 416,
    },
    {
      name: "The Walking Dead Vol. 1",
      description: "Rick Grimes wakes from a coma to find the world overrun by zombies. Survival horror begins.",
      author: "Robert Kirkman",
      price: 799,
      coverImage: "/images/banner2.png",
      publishedAt: new Date(currentYear, currentMonth, 15),
      stock: 40,
      isbn: "978-1582406725",
      pages: 144,
    },
    {
      name: "Batman: Year One",
      description: "The definitive origin story of Batman, chronicling Bruce Wayne's first year as Gotham's protector.",
      author: "Frank Miller",
      price: 1299,
      coverImage: "/images/banner3.png",
      publishedAt: new Date(currentYear, currentMonth, 18),
      stock: 18,
      isbn: "978-1563893407",
      pages: 144,
    },
    {
      name: "Invincible Vol. 1",
      description: "Mark Grayson inherits superpowers from his father, the most powerful superhero on Earth.",
      author: "Robert Kirkman",
      price: 699,
      coverImage: "/images/banner1.png",
      publishedAt: new Date(currentYear, currentMonth, 20),
      stock: 35,
      isbn: "978-1582407470",
      pages: 192,
    },
    {
      name: "Sandman Vol. 1: Preludes & Nocturnes",
      description: "Morpheus, the Lord of Dreams, escapes captivity after 70 years and must reclaim his realm.",
      author: "Neil Gaiman",
      price: 1599,
      coverImage: "/images/banner2.png",
      publishedAt: new Date(currentYear, currentMonth, 22),
      stock: 22,
      isbn: "978-1563890116",
      pages: 240,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { name: book.name },
      update: book,
      create: book,
    });
    console.log(`✓ Created book: ${book.name} - ₹${book.price}`);
  }

  // Create sample wishlist items
  const sampleUser = await prisma.user.findUnique({
    where: { email: 'john@example.com' },
  });

  const sampleBooks = await prisma.book.findMany({ take: 3 });

  if (sampleUser && sampleBooks.length > 0) {
    for (const book of sampleBooks) {
      await prisma.wishlist.upsert({
        where: {
          userId_bookId: {
            userId: sampleUser.id,
            bookId: book.id,
          },
        },
        update: {},
        create: {
          userId: sampleUser.id,
          bookId: book.id,
        },
      });
      console.log(`✓ Added to wishlist: ${book.name}`);
    }
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📋 Admin Credentials:');
  console.log('   Email: admin@purpleskull.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
