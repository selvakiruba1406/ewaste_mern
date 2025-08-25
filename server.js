import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import {connectDB}  from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();

// middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || ["http://localhost:3000"], credentials: true }));

app.use(express.json());   // << do not forget

app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// health
app.get("/", (_req, res) => res.send("E-Waste API running"));
app.post("/test", (req, res) => {
  console.log(req.body);
  res.json({ message: "POST working", data: req.body });
});


const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
