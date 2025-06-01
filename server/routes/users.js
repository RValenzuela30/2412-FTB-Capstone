const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorize");

const VALID_ROLES = ["admin", "customer", "guest"];

// GET all users (admin only)
router.get("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mailingAddress: true,
        billingInfo: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET a specific user by ID (admin or self)
router.get("/:id", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders:
          req.user?.id === userId || req.user?.role === "admin" ? true : false,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST create new user (admin only) — requires password
router.post("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const {
    name,
    email,
    password,
    role = "customer",
    mailingAddress,
    billingInfo,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({
      error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        mailingAddress,
        billingInfo,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mailingAddress: true,
        billingInfo: true,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);

    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      return res.status(409).json({ error: "That email is already in use." });
    }

    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT update user (admin only)
router.put("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, role } = req.body;

  if (role && !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Invalid role.` });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE user (admin only)
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const deleted = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: `User ${userId} deleted` });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
