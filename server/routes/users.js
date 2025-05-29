// basic reqs
const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// maybe we need bcrypt and JWT?
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
// if we're doing roles we should define them
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorize");

const VALID_ROLES = ["admin", "customer", "guest"];

router.get("/", (req, res) => {
  res.send("Testing Users");
});

// GET all users here
router.get("/", authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      // only fetches "safe" fields so no password but everything else
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

// GET users by ID
router.get("/:id", async (req, res) => {
  //Parses the ID from the URL
  // Authenticates the request
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      //Uses Prisma’s findUnique to get one user
      where: { id: userId },
      include: {
        orders:
          req.user?.id === userId || req.user?.role === "admin" ? true : false,
      }, //Only includes orders if: The logged-in user is the same as the one being requested, or they are an admin
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...safeUser } = user; //Excludes password from the response
    res.json(safeUser);
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
    role = "customer", // makes sure it's a valid role
    mailingAddress,
    billingInfo,
  } = req.body;

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({
      error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // hash the password

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

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);

    // Custom error for duplicate email
    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      return res.status(409).json({ error: "That email is already in use." });
    }

    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT update user
// need to figure out how to update only one section without altering the other sections

// DELETE user
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    const userId = parseInt(req.params.id);

    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

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
  }
);

module.exports = router;
