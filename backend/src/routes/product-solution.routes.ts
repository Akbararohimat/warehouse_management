import { Router } from "express";

import {
  getProductSolutions,
  getProductSolutionById,
  createProductSolution,
  updateProductSolution,
  uploadProductSolutionDocuments,
  deleteProductSolutionDocument,
  deleteProductSolution,
} from "../controllers/product-solution.controller";

import uploadPdf from "../middleware/upload-pdf";

const router = Router();

router.get("/", getProductSolutions);

router.get("/:id", getProductSolutionById);

router.post("/", createProductSolution);

router.put("/:id", updateProductSolution);

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