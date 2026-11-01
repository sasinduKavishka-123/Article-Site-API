import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/user.model";
import { changeActive, createArticle, getAllArticles, getArticleById, getMyArticles } from "../controllers/article.controller";

const router = Router()

router.post(
    "/", 
    authenticate,
    requireRole([UserRole.ADMIN, UserRole.USER]),
    createArticle
)

router.get( "/", getAllArticles )

router.get("/my-articles", authenticate, getMyArticles)

router.get("/:id", getArticleById)

router.patch("/:id/change-activ", authenticate, changeActive)

export default router