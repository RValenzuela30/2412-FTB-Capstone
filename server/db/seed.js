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
  const users = await prisma.user.createMany({
    data: [
      { name: 'Alice Admin', email: 'alice@admin.com', password: hashedPassword, role: 'admin' },
      { name: 'Bob Admin', email: 'bob@admin.com', password: hashedPassword, role: 'admin' },
      { name: 'Cathy Customer', email: 'cathy@customer.com', password: hashedPassword, role: 'customer', mailingAddress: "123 Main St", billingInfo: "Visa 1234" },
      { name: 'Dan Customer', email: 'dan@customer.com', password: hashedPassword, role: 'customer', mailingAddress: "456 Oak Ave", billingInfo: "Mastercard 5678" },
    ],
  });

  console.log("Users seeded");

  // Seed products
  const createdProducts = await prisma.product.createMany({
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

  const allProducts = await prisma.product.findMany();
  const customers = await prisma.user.findMany({ where: { role: 'customer' } });

  // Create mock orders for Cathy and Dan
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: "ORD-1001",
        userId: customers.find(u => u.email === 'cathy@customer.com').id,
        orderCost: 9.99 + 24.99,
        shippingInfo: "123 Main St",
        billingInfo: "Visa 1234",
        orderItems: {
          create: [
            { productId: allProducts[0].id, quantity: 1 }, // Chew Toy
            { productId: allProducts[1].id, quantity: 1 }, // Scratching Post
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: "ORD-1002",
        userId: customers.find(u => u.email === 'dan@customer.com').id,
        orderCost: 39.99 + 14.99 + 12.99,
        shippingInfo: "456 Oak Ave",
        billingInfo: "Mastercard 5678",
        orderItems: {
          create: [
            { productId: allProducts[2].id, quantity: 1 }, // Dog Bed
            { productId: allProducts[3].id, quantity: 1 }, // Bird Feeder
            { productId: allProducts[8].id, quantity: 1 }, // Dog Leash
          ],
        },
      },
    }),
  ]);

  console.log("Orders seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
