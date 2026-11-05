import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { UserRole } from "../models/user.model";
import { createComment } from "../controllers/comment.controller";

const router = Router()

router.post(
    "/",
    authenticate,
    requireRole([UserRole.ADMIN, UserRole.USER]),
    createComment
)

export default router