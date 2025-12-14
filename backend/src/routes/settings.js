import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

// GET /api/settings
router.get("/", async (req, res) => {
  const prisma = req.prisma;
  const { organizationId } = req.user;

  const setting = await prisma.setting.findUnique({ where: { organizationId } });
  res.json(setting);
});

// PUT /api/settings
router.put("/", async (req, res) => {
  const prisma = req.prisma;
  const { organizationId } = req.user;
  const { defaultLowStock } = req.body;

  if (typeof defaultLowStock !== "number") {
    return res.status(400).json({ message: "defaultLowStock must be number" });
  }

  const existing = await prisma.setting.findUnique({ where: { organizationId } });

  const setting = existing
    ? await prisma.setting.update({
        where: { organizationId },
        data: { defaultLowStock }
      })
    : await prisma.setting.create({
        data: { organizationId, defaultLowStock }
      });

  res.json(setting);
});

export default router;
