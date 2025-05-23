const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products");

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
    ],
  });

  console.log("Products seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
