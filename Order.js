import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, default: 1, min: 1 },
    deliveryAddress: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "delivered"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
