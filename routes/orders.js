const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/auth");

const prisma = new PrismaClient();

// do we even need a GET all orders? I feel like that would be something only the admin can do but functionally it would mean getting ALL orders from EVERYONE so
// I think instead it should be like get order by ID only and only the customer and the admin can have access to that

// --> GET ALL orders

router.get("/", (req, res) => {
  res.send("Testing Orders");
});


// GET orders for logged-in user
router.get("/my-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      // fetch all orders from the db and return as a json
      where: { userId: req.user.id },
      include: { orderItems: true },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch your orders" });
  }
});

// GET order by ID (customer or admin only)
router.get("/:id", authenticateToken, async (req, res) => {
  //requires authentication token
  const orderId = parseInt(req.params.id);

  try {
    const order = await prisma.order.findUnique({
      // Prisma method to fetch a single row by primary key
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (req.user.id !== order.userId && req.user.role !== "admin") {
      // is not admin or customer?
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST create an order when the user submits
// CREATE order
router.post("/", authenticateToken, async (req, res) => {
  // authentication token again
  const { orderItems, orderCost } = req.body;

  const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`; // looked this up it will give a random order number to any specific order.

  try {
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        orderCost,
        user: { connect: { id: req.user.id } }, //connect this to the logged-in user
        orderItems: {
          // array of objects from client
          create: orderItems.map((item) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
          })),
        },
      },
      include: { orderItems: true }, // Adds child records to OrderItem table, connecting to Product
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = router;
