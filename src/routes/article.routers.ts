import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/user.model";
import { changeActive, createArticle, getAiDescription, getAllAdminArticles, getAllArticles, getArticleById, getArticleCount, getArticlesPerTag, getMostLikedArticles, getMyArticles, toggleLike, updateArticle } from "../controllers/article.controller";
import { upload } from "../middleware/upload"

const router = Router()

router.post(
    "/",
    authenticate,
    requireRole([UserRole.ADMIN, UserRole.USER]),
    upload.single("file"),
    createArticle
)

router.post("/generate-description", authenticate, getAiDescription)

router.put(
    "/",
    authenticate,
    requireRole([UserRole.ADMIN, UserRole.USER]),
    upload.single("file"),
    updateArticle
)

router.get("/", getAllArticles)

router.get("/admin", getAllAdminArticles)

router.get("/my-articles", authenticate, getMyArticles)

router.get("/countAll", getArticleCount)

router.get("/getMostLiked", getMostLikedArticles)

router.get("/per-tag", getArticlesPerTag)

router.get("/:id", getArticleById)

router.patch("/:id/change-activ", authenticate, changeActive)

router.patch("/:id/like", authenticate, toggleLike)

export default router