import { Router } from "express";

import {
  getProductSolutions,
  getProductSolutionById,
  createProductSolution,
  updateProductSolution,
  uploadProductSolutionImage,
  uploadProductSolutionDocuments,
  deleteProductSolutionDocument,
  deleteProductSolution,
} from "../controllers/product-solution.controller";

import uploadPdf from "../middleware/upload-pdf";
import uploadProductImages from "../middleware/upload-product-images";

const router = Router();
router.get("/", getProductSolutions);
router.get("/:id", getProductSolutionById);
router.post("/", createProductSolution);
router.put("/:id", updateProductSolution);
router.post(
  "/:id/image",
  uploadProductImages.single("image"),
  uploadProductSolutionImage
);
router.post(
  "/:id/documents",
  uploadPdf.array("pdfs", 10),
  uploadProductSolutionDocuments
);

router.delete(
  "/:id/documents/:documentId",
  deleteProductSolutionDocument
);

router.delete("/:id", deleteProductSolution);

export default router;