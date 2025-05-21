// basic reqs
const express = require("express");
const router = express.Router();

// maybe we need bcrypt and JWT?
const bcrypt = require("bcrypt");
// if we're doing roles we should define them

const VALID_ROLES = ["admin", "customer", "guest"];

// GET all users here
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET users by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
// need to figure out how to write the users previous orders

// POST new user
router.post("/", async (req, res) => {
  const {
    name,
    email,
    password,
    role = "customer",
    mailing_address,
    billing_info,
    previous_orders = [],
  } = req.body;

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({
      error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
    });
  } // have to choose either admin, customer, or guest?

  try {
    const result = await db.query(
      `INSERT INTO users (name, email, password, role, mailing_address, billing_info, previous_orders)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, role, mailing_address, billing_info, previous_orders`,
      [
        name,
        email,
        hashedPassword, // for authentication?
        role,
        mailing_address,
        billing_info,
        JSON.stringify(previous_orders), // it should only show previous orders if they are logged in
      ]
    );

    res.status(201).json({ message: "User created", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT update user
// need to figure out how to update only one section without altering the other sections

// DELETE user
router.delete("/:id", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id);

  if (req.user.id !== userId && req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: `User ${userId} deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
