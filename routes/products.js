// basic reqs
const express = require("express");
const router = express.Router();

// GET all products here
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST a product -- i think only admin should be able to do this so it would require authentication or at least the correct role
