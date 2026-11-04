import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/user.model";
import { changeActive, createArticle, getAllArticles, getArticleById, getMyArticles, updateArticle } from "../controllers/article.controller";
import { upload } from "../middleware/upload"

const router = Router()

router.post(
    "/",
    authenticate,
    requireRole([UserRole.ADMIN, UserRole.USER]),
    upload.single("image"),
    createArticle
)

router.put(
    "/",
    authenticate,
    requireRole([UserRole.ADMIN, UserRole.USER]),
    upload.single("image"),
    updateArticle
)

router.get("/", getAllArticles)

router.get("/my-articles", authenticate, getMyArticles)

router.get("/:id", getArticleById)

router.patch("/:id/change-activ", authenticate, changeActive)

export default router