import { Router } from "express";

import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  addFollowUp,
} from "../controllers/sales-request.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/:id", getRequestById);
router.put("/:id", updateRequest);
router.post("/:id/follow-up", addFollowUp);

export default router;