import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create product (any logged-in user)
router.post("/", protect, async (req, res) => {
  try {
    const { name, description, image, quantity } = req.body;
    const product = await Product.create({ name, description, image, quantity, uploadedBy: req.user._id });
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// List products (with optional search ?q=)
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? { $or: [{ name: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }] }
      : {};
    const products = await Product.find(filter).sort({ createdAt: -1 }).populate("uploadedBy", "name");
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const myProducts = await Product.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(myProducts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// (Optional) update & delete (owner or admin)
router.put("/:id", protect, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    if (String(p.uploadedBy) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    if (String(p.uploadedBy) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });
    await p.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
