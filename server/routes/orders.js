const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorize");

const prisma = new PrismaClient();

// GET all orders (admin or customer)
router.get(
  "/",
  authenticateToken,
  authorizeRoles("customer", "admin"),
  async (req, res) => {
    try {
      const orders = await prisma.order.findMany({ include: { orderItems: true } });
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }
);

// GET orders for logged-in user
router.get(
  "/my-orders",
  authenticateToken,
  authorizeRoles("customer", "admin"),
  async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        where: { userId: req.user.id },
        include: { orderItems: true },
      });
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch your orders" });
    }
  }
);

// GET order by ID (customer or admin only)
router.get("/:id", authenticateToken, async (req, res) => {
  const orderId = parseInt(req.params.id);

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (req.user.id !== order.userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST create a new order
router.post(
  "/",
  authenticateToken,
  authorizeRoles("customer"),
  async (req, res) => {
    const { items, total, shippingInfo, billingInfo } = req.body;

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          orderCost: total,
          shippingInfo,
          billingInfo,
          user: { connect: { id: req.user.id } },
          orderItems: {
            create: items.map((item) => ({
              product: { connect: { id: item.id } },
              quantity: item.quantity || 1,
            })),
          },
        },
        include: { orderItems: true },
      });

      res.status(201).json(newOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create order" });
    }
  }
);

module.exports = router;
