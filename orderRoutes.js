import express from "express";
import { protect } from "../middleware/auth.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

// Checkout (free order)
router.post("/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1, deliveryAddress } = req.body;
    if (!deliveryAddress) return res.status(400).json({ message: "Delivery address required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.quantity < quantity) return res.status(400).json({ message: "Not enough quantity" });

    // reduce stock
    product.quantity -= quantity;
    await product.save();

    const order = await Order.create({
      product: productId,
      buyer: req.user._id,
      quantity,
      deliveryAddress
    });

    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// My orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("product", "name description image");
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
