import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, organizationName } = req.body;

  if (!email || !password || !organizationName) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const prisma = req.prisma;

  try {
    // optional: explicit email check (safe even if table is empty)
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 1) create organization
    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        settings: {
          create: {},
        },
      },
    });

    // 2) create user linked to organization
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        organizationId: organization.id,   // assumes this FK field exists
      },
    });

    const token = jwt.sign(
      { userId: user.id, orgId: organization.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        organizationId: organization.id,
        organizationName: organization.name,
      },
    });
  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;





