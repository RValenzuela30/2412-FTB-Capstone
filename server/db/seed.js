const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Seed users 
  await prisma.user.createMany({
    data: [
      {
        name: 'Alice Admin',
        email: 'alice@admin.com',
        password: '1111',
        role: 'admin',
      },
      {
        name: 'Bob Admin',
        email: 'bob@admin.com',
        password: '1111',
        role: 'admin',
      },
      {
        name: 'Cathy Customer',
        email: 'cathy@customer.com',
        password: '1111',
        role: 'customer',
      },
      {
        name: 'Dan Customer',
        email: 'dan@customer.com',
        password: '1111',
        role: 'customer',
      },
    ],
  });

  console.log("Users seeded");

  // Seed products
  await prisma.product.createMany({
    data: [
      {
        name: 'Chew Toy',
        price: 9.99,
        imageUrl: 'https://via.placeholder.com/150?text=Chew+Toy',
      },
      {
        name: 'Cat Scratching Post',
        price: 24.99,
        imageUrl: 'https://via.placeholder.com/150?text=Scratching+Post',
      },
      {
        name: 'Dog Bed',
        price: 39.99,
        imageUrl: 'https://via.placeholder.com/150?text=Dog+Bed',
      },
      {
        name: 'Bird Feeder',
        price: 14.99,
        imageUrl: 'https://via.placeholder.com/150?text=Bird+Feeder',
      },
      {
        name: 'Fish Tank',
        price: 59.99,
        imageUrl: 'https://via.placeholder.com/150?text=Fish+Tank',
      },
      {
        name: 'Rabbit Hutch',
        price: 89.99,
        imageUrl: 'https://via.placeholder.com/150?text=Rabbit+Hutch',
      },
      {
        name: 'Reptile Heat Lamp',
        price: 19.99,
        imageUrl: 'https://via.placeholder.com/150?text=Heat+Lamp',
      },
      {
        name: 'Pet Shampoo',
        price: 7.99,
        imageUrl: 'https://via.placeholder.com/150?text=Pet+Shampoo',
      },
      {
        name: 'Hamster Wheel',
        price: 12.49,
        imageUrl: 'https://via.placeholder.com/150?text=Hamster+Wheel',
      },
    ],
  });

  console.log("Products seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
