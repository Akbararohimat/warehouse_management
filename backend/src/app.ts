import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import salesRequestRoutes from "./routes/sales-request.routes";
import companyRoutes from "./routes/company.routes";
import contactRoutes from "./routes/contact.routes";
import productRoutes from "./routes/product.routes";
import productSolutionRoutes from "./routes/product-solution.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Warehouse Management API is running",
  });
});

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sales-requests", salesRequestRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-solutions", productSolutionRoutes);

export default app;