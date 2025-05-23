// basic reqs
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET all products here
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany(); //basically all copied from the orders.js and users.js
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST a product -- i think only admin should be able to do this so it would require authentication or at least the correct role
router.post("/", authenticateToken, async (req, res) => {
  const { name, price, imageUrl } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: { name, price, imageUrl },
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});
// PUT update product
router.put("/:id", authenticateToken, async (req, res) => {
  // authentication key
  const productId = parseInt(req.params.id);
  const { name, price, imageUrl } = req.body;

  try {
    const updated = await prisma.product.update({
      where: { id: productId }, // update where the id is either name, price, or the image (idk if this is necessary tho)
      data: { name, price, imageUrl },
    });

    res.json(updated);
  } catch (err) {
    if (err.code === "P2025") {
      // looked up error code
      return res.status(404).json({ error: "Product not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product
router.delete("/:id", authenticateToken, async (req, res) => {
  // needs auth again
  const productId = parseInt(req.params.id);

  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    res.json({ message: `Product ${productId} deleted` });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
