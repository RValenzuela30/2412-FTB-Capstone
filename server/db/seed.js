const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash("1111", SALT_ROUNDS);

  // Seed users
  await prisma.user.createMany({
    data: [
      { name: 'Alice Admin', email: 'alice@admin.com', password: hashedPassword, role: 'admin' },
      { name: 'Bob Admin', email: 'bob@admin.com', password: hashedPassword, role: 'admin' },
      { name: 'Cathy Customer', email: 'cathy@customer.com', password: hashedPassword, role: 'customer' },
      { name: 'Dan Customer', email: 'dan@customer.com', password: hashedPassword, role: 'customer' },
    ],
  });

  console.log("Users seeded");

  // Seed products
  await prisma.product.createMany({
    data: [
      { name: 'Chew Toy', price: 9.99, imageUrl: 'https://i.ebayimg.com/images/g/Y1kAAOSwQXVmSWvq/s-l1200.png' },
      { name: 'Cat Scratching Post', price: 24.99, imageUrl: 'https://shop.hauspanther.com/cdn/shop/products/RoundPost2_2048x2048.jpg?v=1606144747' },
      { name: 'Dog Bed', price: 39.99, imageUrl: 'https://snoozerpetproducts.com/wp-content/uploads/2022/03/overstuffed-dog-sofa-lifestyle-sapphire-1-4.jpg' },
      { name: 'Bird Feeder', price: 14.99, imageUrl: 'https://images.thdstatic.com/productImages/f0e8de80-0243-4cac-9f04-151c219db801/svn/copper-perky-pet-bird-feeders-312c-c3_600.jpg' },
      { name: 'Hamster Wheel', price: 19.99, imageUrl: 'https://m.media-amazon.com/images/I/513WxFGTvYL._AC_UF1000,1000_QL80_.jpg' },
      { name: 'Fish Tank', price: 59.99, imageUrl: 'https://i5.walmartimages.com/seo/Aqua-Culture-10-Gallon-Glass-Aquarium-Starter-Kit_e6976bf3-a974-425a-b72f-061889abea0c.a6d5ccb879cd72e05e521edb53000114.jpeg' },
      { name: 'Rabbit Hutch', price: 89.99, imageUrl: 'https://s7d2.scene7.com/is/image/PetSmart/5181405?fmt=webp&wid=400&hei=400' },
      { name: 'Pet Carrier', price: 29.99, imageUrl: 'https://www.lillyandmax.com/wp-content/uploads/2021/04/ElitePet-Front-Dog-Carrier-Black.jpg' },
      { name: 'Dog Leash', price: 12.99, imageUrl: 'https://headsupfortails.com/cdn/shop/files/DSC_9356-Edit.jpg?v=1739043822&width=1946' },
    ],
  });

  console.log("Products seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
