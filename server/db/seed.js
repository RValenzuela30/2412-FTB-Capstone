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
      { name: 'Chew Toy', price: 9.99, imageUrl: 'https://via.placeholder.com/150?text=Chew+Toy' },
      { name: 'Cat Scratching Post', price: 24.99, imageUrl: 'https://via.placeholder.com/150?text=Scratching+Post' },
      { name: 'Dog Bed', price: 39.99, imageUrl: 'https://via.placeholder.com/150?text=Dog+Bed' },
      { name: 'Bird Feeder', price: 14.99, imageUrl: 'https://via.placeholder.com/150?text=Bird+Feeder' },
      { name: 'Hamster Wheel', price: 19.99, imageUrl: 'https://via.placeholder.com/150?text=Hamster+Wheel' },
      { name: 'Fish Tank', price: 59.99, imageUrl: 'https://via.placeholder.com/150?text=Fish+Tank' },
      { name: 'Rabbit Hutch', price: 89.99, imageUrl: 'https://via.placeholder.com/150?text=Rabbit+Hutch' },
      { name: 'Pet Carrier', price: 29.99, imageUrl: 'https://via.placeholder.com/150?text=Pet+Carrier' },
      { name: 'Dog Leash', price: 12.99, imageUrl: 'https://via.placeholder.com/150?text=Dog+Leash' },
    ],
  });

  console.log("Products seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
