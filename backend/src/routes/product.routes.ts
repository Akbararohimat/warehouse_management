import { Router } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductsPdf,
  uploadProductImages,
  replaceProductImages,
} from "../controllers/product.controller";

import uploadPdf from "../middleware/upload-pdf";
import uploadProductImagesMiddleware from "../middleware/upload-product-images";

const router = Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", createProduct);

router.put("/:id", updateProduct);

router.post(
  "/:id/pdf",
  uploadPdf.single("pdf"),
  uploadProductsPdf
);

router.post(
  "/:id/images",
  uploadProductImagesMiddleware.array("images", 5),
  uploadProductImages
);

router.put(
  "/:id/images",
  uploadProductImagesMiddleware.array("images", 5),
  replaceProductImages
);
router.delete("/:id", deleteProduct);

export default router;