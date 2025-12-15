import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// SIGNUP (your existing code)... keep as is

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  const prisma = req.prisma;

  try {
    // 1) find user by email ONLY
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2) compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3) create token
    const token = jwt.sign(
      { userId: user.id, orgId: user.organizationId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4) send response consistent with signup
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        organizationId: user.organizationId,
        organizationName: user.organization.name,
      },
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
