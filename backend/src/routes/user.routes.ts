import { Router } from "express";

import {
  getMe,
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} from "../controllers/user.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/me",
  authenticate,
  getMe
);

router.get(
  "/admin-test",
  authenticate,
  requireRole("ADMIN"),
  (_req, res) => {
    res.json({
      success: true,
      message: "Anda memiliki akses ADMIN",
    });
  }
);

router.get(
  "/",
  authenticate,
  requireRole("ADMIN"),
  getUsers
);

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  createUser
);

router.patch(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  updateUser
);

router.patch(
  "/:id/status",
  authenticate,
  requireRole("ADMIN"),
  updateUserStatus
);

router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  deleteUser
);

export default router;