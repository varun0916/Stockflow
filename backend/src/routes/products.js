import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// All routes below require auth
router.use(authMiddleware);

// GET /api/products
router.get("/", async (req, res) => {
  const prisma = req.prisma;
  const { organizationId } = req.user;

  const products = await prisma.product.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" }
  });

  res.json(products);
});

// POST /api/products
router.post("/", async (req, res) => {
  const prisma = req.prisma;
  const { organizationId } = req.user;
  const {
    name,
    sku,
    description,
    quantityOnHand,
    costPrice,
    sellingPrice,
    lowStockThreshold
  } = req.body;

  if (!name || !sku) {
    return res.status(400).json({ message: "Name and SKU required" });
  }

  try {
    const product = await prisma.product.create({
      data: {
        organizationId,
        name,
        sku,
        description: description || null,
        quantityOnHand: quantityOnHand ?? 0,
        costPrice: costPrice ?? null,
        sellingPrice: sellingPrice ?? null,
        lowStockThreshold: lowStockThreshold ?? null
      }
    });
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ message: "Could not create product", error: e.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const prisma = req.prisma;
  const { organizationId } = req.user;
  const id = Number(req.params.id);

  const product = await prisma.product.findFirst({
    where: { id, organizationId }
  });
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  const prisma = req.prisma;
  const { organizationId } = req.user;
  const id = Number(req.params.id);
  const data = req.body;

  const existing = await prisma.product.findFirst({
    where: { id, organizationId }
  });
  if (!existing) return res.status(404).json({ message: "Not found" });

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      sku: data.sku ?? existing.sku,
      description: data.description ?? existing.description,
      quantityOnHand:
        data.quantityOnHand !== undefined ? data.quantityOnHand : existing.quantityOnHand,
      costPrice: data.costPrice ?? existing.costPrice,
      sellingPrice: data.sellingPrice ?? existing.sellingPrice,
      lowStockThreshold:
        data.lowStockThreshold !== undefined
          ? data.lowStockThreshold
          : existing.lowStockThreshold
    }
  });

  res.json(updated);
});

// DELETE /api/products/:id (hard delete, per MVP)
router.delete("/:id", async (req, res) => {
  const prisma = req.prisma;
  const { organizationId } = req.user;
  const id = Number(req.params.id);

  const existing = await prisma.product.findFirst({
    where: { id, organizationId }
  });
  if (!existing) return res.status(404).json({ message: "Not found" });

  await prisma.product.delete({ where: { id } });
  res.status(204).end();
});

// POST /api/products/:id/adjust-stock  (optional FR‑5)
router.post("/:id/adjust-stock", async (req, res) => {
  const prisma = req.prisma;
  const { organizationId, id: userId } = req.user;
  const productId = Number(req.params.id);
  const { delta } = req.body; // +N or -N

  if (typeof delta !== "number") {
    return res.status(400).json({ message: "delta must be number" });
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, organizationId }
  });
  if (!product) return res.status(404).json({ message: "Not found" });

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      quantityOnHand: product.quantityOnHand + delta
      // you can also store lastUpdatedBy: userId if you add that field
    }
  });

  res.json(updated);
});

export default router;
