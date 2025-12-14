import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

// GET /api/dashboard
router.get("/", async (req, res) => {
  const prisma = req.prisma;
  const { organizationId } = req.user;

  const [products, setting] = await Promise.all([
    prisma.product.findMany({ where: { organizationId } }),
    prisma.setting.findUnique({ where: { organizationId } })
  ]);

  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantityOnHand, 0);

  const defaultThreshold = setting?.defaultLowStock ?? 5;

  const lowStockItems = products.filter((p) => {
    const threshold = p.lowStockThreshold ?? defaultThreshold;
    return p.quantityOnHand <= threshold;
  });

  res.json({
    totalProducts,
    totalQuantity,
    lowStockItems
  });
});

export default router;
