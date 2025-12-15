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
    // 1) optional: check if user email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    console.log("SIGNUP existing user for", email, "=>", existing);
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }


    // 2) hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3) create organization + user + settings (your block)
    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        users: {
          create: {
            email,
            passwordHash,
          },
        },
        settings: {
          create: {},
        },
      },
      include: {
        users: true,
      },
    });

    // 4) build response
    const user = organization.users[0];

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





