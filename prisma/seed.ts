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

  // Create sample books with all new fields
  const books = [
    {
      name: "The Dark Knight Returns",
      description: "Batman comes out of retirement to fight crime in a futuristic Gotham. This landmark graphic novel redefined the Dark Knight, showing him as a grizzled veteran who takes on a new generation of criminals. The story explores themes of justice, aging, and the nature of heroism in a world that's moved past its golden age of heroes. Frank Miller's dark, gritty art style revolutionized how comics could look and feel, influencing an entire generation of storytellers. This is essential reading for any Batman fan.",
      author: "Frank Miller",
      publisher: "DC Comics",
      price: 1499,
      coverImage: "/images/banner1.png",
      publishedAt: new Date(2024, currentMonth, 1),
      stock: 25,
      isbn: "978-1563893421",
      pages: 224,
      language: "English",
      rating: 4.8,
      reviewCount: 342,
      series: "Batman: Dark Knight",
      characters: JSON.stringify(["Batman", "Superman", "Green Lantern"]),
    },
    {
      name: "Spider-Man: Blue",
      description: "A touching love story between Peter Parker and Gwen Stacy, told through Valentine's Day memories. Jeph Loeb and Tim Sale create a beautiful, melancholic tribute to one of comics' greatest romances. The story weaves between present-day Valentine's celebrations and flashbacks to key moments in Peter and Gwen's relationship. Sale's stunning blue-tinted artwork perfectly captures the emotional weight of this tale. This is more than just a Spider-Man story—it's a meditation on love, loss, and memory.",
      author: "Jeph Loeb & Tim Sale",
      publisher: "Marvel Comics",
      price: 1799,
      coverImage: "/images/banner2.png",
      publishedAt: new Date(2024, currentMonth, 5),
      stock: 15,
      isbn: "978-0785110864",
      pages: 168,
      language: "English",
      rating: 4.6,
      reviewCount: 187,
      series: "Spider-Man: Blue",
      characters: JSON.stringify(["Spider-Man", "Gwen Stacy", "Mary Jane"]),
    },
    {
      name: "Saga Vol. 1",
      description: "An epic space opera following two lovers from warring alien races and their newborn daughter. Brian K. Vaughan and Fiona Staples created a universe-spanning tale that's part Star Wars, part Romeo and Juliet, and wholly original. Alana and Marko are soldiers on opposite sides of a galactic war who fall in love and have a child—now they must run from both armies while raising their baby in a dangerous universe. The series has won numerous awards and redefined what comics can accomplish.",
      author: "Brian K. Vaughan",
      publisher: "Image Comics",
      price: 899,
      coverImage: "/images/banner3.png",
      publishedAt: new Date(2024, currentMonth, 8),
      stock: 30,
      isbn: "978-1607066019",
      pages: 160,
      language: "English",
      rating: 4.9,
      reviewCount: 521,
      series: "Saga",
      characters: JSON.stringify(["Alana", "Marko", "Hazel"]),
    },
    {
      name: "Watchmen",
      description: "A groundbreaking deconstruction of the superhero genre in an alternate 1985 America. Alan Moore and Dave Gibbons created what many consider the greatest graphic novel ever made. In a world where superheroes exist but are largely repressed, the murder of one of their own sets off a complex conspiracy. The story examines morality, power, and what it truly means to be a hero. Its twelve-issue format has been studied in universities and influenced countless creators across media.",
      author: "Alan Moore",
      publisher: "DC Comics",
      price: 2299,
      coverImage: "/images/banner1.png",
      publishedAt: new Date(2024, currentMonth, 12),
      stock: 20,
      isbn: "978-0930289232",
      pages: 416,
      language: "English",
      rating: 4.9,
      reviewCount: 892,
      series: "Watchmen",
      characters: JSON.stringify(["Rorschach", "Nite Owl", "Dr. Manhattan", "Silk Spectre"]),
    },
    {
      name: "The Walking Dead Vol. 1",
      description: "Rick Grimes wakes from a coma to find the world overrun by zombies. He searches for his family and finds a group of survivors at a farm. But the farm isn't as safe as it seems... This is just the beginning of an epic survival story that explores not just the horror of the zombie apocalypse, but the human drama that emerges when society collapses. Robert Kirkman created a world where the real threat isn't the undead—it's the living.",
      author: "Robert Kirkman",
      publisher: "Image Comics",
      price: 799,
      coverImage: "/images/banner2.png",
      publishedAt: new Date(2024, currentMonth, 15),
      stock: 40,
      isbn: "978-1582406725",
      pages: 144,
      language: "English",
      rating: 4.7,
      reviewCount: 445,
      series: "The Walking Dead",
      characters: JSON.stringify(["Rick Grimes", "Carl Grimes", "Daryl Dixon", "Michonne"]),
    },
    {
      name: "Batman: Year One",
      description: "The definitive origin story of Batman, chronicling Bruce Wayne's first year as Gotham's protector. Frank Miller's dark vision of Batman as a dangerous vigilante contrasts with Jim Gordon's story as an honest cop trying to clean up Gotham. Together, they represent two different approaches to justice in a corrupt city. This story has influenced every Batman adaptation since its release and remains the gold standard for Batman origin stories.",
      author: "Frank Miller",
      publisher: "DC Comics",
      price: 1299,
      coverImage: "/images/banner3.png",
      publishedAt: new Date(2024, currentMonth, 18),
      stock: 18,
      isbn: "978-1563893407",
      pages: 144,
      language: "English",
      rating: 4.8,
      reviewCount: 298,
      series: "Batman: Year One",
      characters: JSON.stringify(["Batman", "Catwoman", "Gordon"]),
    },
    {
      name: "Invincible Vol. 1",
      description: "Mark Grayson inherits superpowers from his father, the most powerful superhero on Earth. But being a hero is harder than it looks when you're a teenager. Robert Kirkman created Invincible as a superhero story that deconstructs the genre while celebrating everything fans love about it. Mark's journey from awkward teen to world-saving hero is both action-packed and emotionally resonant.",
      author: "Robert Kirkman",
      publisher: "Image Comics",
      price: 699,
      coverImage: "/images/banner1.png",
      publishedAt: new Date(2024, currentMonth, 20),
      stock: 35,
      isbn: "978-1582407470",
      pages: 192,
      language: "English",
      rating: 4.5,
      reviewCount: 234,
      series: "Invincible",
      characters: JSON.stringify(["Invincible", "Omnipus", "Atom Eve"]),
    },
    {
      name: "Sandman Vol. 1: Preludes & Nocturnes",
      description: "Morpheus, the Lord of Dreams, escapes captivity after 70 years and must reclaim his realm. Neil Gaiman's magnum opus begins here, introducing us to Dream and the various realms of the Endless. This volume establishes the mythic tone of the series, featuring stories that range from horror to fantasy to mythology. Gaiman's prose is poetic and evocative, while artists like Sam Kieth bring these dreams to life.",
      author: "Neil Gaiman",
      publisher: "DC Comics - Vertigo",
      price: 1599,
      coverImage: "/images/banner2.png",
      publishedAt: new Date(2024, currentMonth, 22),
      stock: 22,
      isbn: "978-1563890116",
      pages: 240,
      language: "English",
      rating: 4.9,
      reviewCount: 567,
      series: "The Sandman",
      characters: JSON.stringify(["Dream", "Death", "Lucifer", "John Constantine"]),
    },
    // New books with detailed data
    {
      name: "X-Men: Days of Future Past",
      description: "A dystopian future where mutants are hunted by Sentinels. Kitty Pryde travels back in time to prevent this terrible fate. Chris Claremont and John Byrne created one of the most influential X-Men stories ever told. The political subtext about persecution and tolerance gives this story lasting relevance. The stakes have never been higher as the fate of mutantkind hangs in the balance.",
      author: "Chris Claremont",
      publisher: "Marvel Comics",
      price: 1199,
      coverImage: "/images/banner1.png",
      publishedAt: new Date(2024, 1, 10),
      stock: 28,
      isbn: "978-0785131722",
      pages: 156,
      language: "English",
      rating: 4.7,
      reviewCount: 189,
      series: "X-Men",
      characters: JSON.stringify(["Wolverine", "Storm", "Cyclops", "Kitty Pryde"]),
    },
    {
      name: "V for Vendetta",
      description: "In a dystopian future Britain, a mysterious anarchist known only as 'V' battles against a fascist government. Alan Moore and David Lloyd created a powerful political allegory about resistance, terrorism, and the nature of freedom. V is both hero and villain, and the ending challenges readers to question their assumptions about revolution and justice.",
      author: "Alan Moore",
      publisher: "DC Comics - Vertigo",
      price: 1399,
      coverImage: "/images/banner2.png",
      publishedAt: new Date(2024, 2, 15),
      stock: 16,
      isbn: "978-0930289522",
      pages: 296,
      language: "English",
      rating: 4.6,
      reviewCount: 312,
      series: "V for Vendetta",
      characters: JSON.stringify(["V", "Evey Hammond", "Inspector Finch"]),
    },
    {
      name: "Hellboy: Seed of Destruction",
      description: "The first Hellboy story introduces the world's paranormal investigator. Born in blood on a WWII battlefield, Hellboy is the world's greatest paranormal investigator. Mike Mignola created a unique blend of horror, action, and mythology that has become one of comics' most beloved franchises. This volume establishes Hellboy's world and his mysterious origins.",
      author: "Mike Mignola",
      publisher: "Dark Horse Comics",
      price: 999,
      coverImage: "/images/banner3.png",
      publishedAt: new Date(2024, 3, 20),
      stock: 24,
      isbn: "978-1569719027",
      pages: 128,
      language: "English",
      rating: 4.5,
      reviewCount: 178,
      series: "Hellboy",
      characters: JSON.stringify(["Hellboy", "Abe Sapien", "Liz Sherman"]),
    },
    {
      name: "Y: The Last Man Vol. 1",
      description: "A mysterious plague kills every male mammal on Earth—except one man and his pet monkey. Brian K. Vaughan and Pia Guerra created a brilliant exploration of gender, society, and what it means to be human. Yorick Brown is the last man on Earth, and his journey to find out why he's the sole survivor is both thrilling and thought-provoking.",
      author: "Brian K. Vaughan",
      publisher: "DC Comics - Vertigo",
      price: 1099,
      coverImage: "/images/banner1.png",
      publishedAt: new Date(2024, 4, 5),
      stock: 19,
      isbn: "978-1563899799",
      pages: 176,
      language: "English",
      rating: 4.7,
      reviewCount: 267,
      series: "Y: The Last Man",
      characters: JSON.stringify(["Yorick Brown", "355", "Hero"]),
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
  console.log('\n📚 Books added with:');
  console.log('   - Publisher');
  console.log('   - Characters (JSON array)');
  console.log('   - Rating (0-5 stars)');
  console.log('   - Review count');
  console.log('   - Series name');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
