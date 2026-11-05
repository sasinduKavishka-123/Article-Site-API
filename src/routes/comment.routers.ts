import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { UserRole } from "../models/user.model";
import { createComment, getCommentsByArticle } from "../controllers/comment.controller";

const router = Router()

router.post(
    "/",
    authenticate,
    requireRole([UserRole.ADMIN, UserRole.USER]),
    createComment
)

router.get(
    "/:articleId",
    getCommentsByArticle
)

export default router