import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { UserRole } from "../models/user.model";
import { createComment, deleteComment, getCommentsByArticle } from "../controllers/comment.controller";

const router = Router()

router.post(
    "/",
    authenticate,
    requireRole([UserRole.ADMIN, UserRole.USER]),
    createComment
)

router.get("/:articleId", getCommentsByArticle)

router.delete(
    "/:commentId",
    authenticate,
    requireRole([UserRole.ADMIN, UserRole.USER]),
    deleteComment
)

export default router