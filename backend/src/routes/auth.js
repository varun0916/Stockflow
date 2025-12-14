import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { email, password, organizationName } = req.body;
  if (!email || !password || !organizationName) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const prisma = req.prisma;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const organization = await prisma.organization.create({
    data: {
      name: organizationName,
      users: {
        create: {
          email,
          passwordHash
        }
      },
      settings: {
        create: {
          defaultLowStock: 5
        }
      }
    },
    include: { users: true }
  });

  const user = organization.users[0];

  const token = jwt.sign(
    {
      userId: user.id,
      organizationId: organization.id
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email },
    organization: { id: organization.id, name: organization.name }
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const prisma = req.prisma;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      organizationId: user.organizationId
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email },
    organization: { id: user.organization.id, name: user.organization.name }
  });
});

export default router;
