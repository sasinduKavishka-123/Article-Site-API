import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { UserModel } from "../models/user.model";
import { ArticleModel } from "../models/article.model";
import mongoose from "mongoose";
import { uploadImage } from "../services/storage.service";
import { cleanList, deleteImageByUrl } from "../util/article";

const BUCKET = "article_images"

export const createArticle = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, gameNames, tags } = req.body

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "Title is required." });
        }
        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({ message: "Content is required." });
        }

        const userId = req.user?.sub
        if (!userId) { return res.status(401).json({ message: "Unauthorized" }) }

        const user = await UserModel.findById(userId).select("-password")
        if (!user) { return res.status(404).json({ message: "User not found" }) }

        const coverImageUrl = req.file ? await uploadImage(userId, req.file, BUCKET) : ""

        const article = await ArticleModel.create({
            title,
            content,
            gameNames: cleanList(JSON.parse(gameNames)),
            tags: cleanList(JSON.parse(tags), { lowercase: true }),
            coverImageUrl,
            author: user._id,
        })

        res.status(201).json(article)
    }
    catch (err: any) {
        console.log(err)
        res.status(500).json({ error: err.message ? err.message : "Internal Sever Error" })
    }
}

export const updateArticle = async (req: AuthRequest, res: Response) => {
    try {
        const { id, title, content, gameNames, tags } = req.body

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "Title is required." });
        }
        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({ message: "Content is required." });
        }

        const userId = req.user?.sub
        if (!userId) { return res.status(401).json({ message: "Unauthorized" }) }

        const user = await UserModel.findById(userId).select("-password")
        if (!user) { return res.status(404).json({ message: "User not found" }) }

        const article = await ArticleModel.findById(id)
        if (!article) { return res.status(404).json({ message: "Article not found" }) }

        const oldUrl = article.coverImageUrl

        const coverImageUrl = req.file ? await uploadImage(userId, req.file, "article_images") : ""

        article.title = title
        article.content = content
        article.gameNames = cleanList(JSON.parse(gameNames))
        article.tags = cleanList(JSON.parse(tags), { lowercase: true })
        article.coverImageUrl = coverImageUrl

        const newArticle = await article.save()

        if (oldUrl && oldUrl !== newArticle.coverImageUrl) {
            await deleteImageByUrl(oldUrl, userId)

        }

        res.status(200).json(newArticle)
    }
    catch (err: any) {
        console.log(err)
        res.status(500).json({ error: err.message ? err.message : "Internal Sever Error" })
    }
}

export const getAllArticles = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        const isActive: any = req.query.isActive
        const s = (req.query.search as string || "").trim()

        const fixed = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(fixed, "i")

        const articles = await ArticleModel
            .find({
                isActive: isActive,
                $or: [{ gameNames: regex }, { tags: regex }, { title: regex }]
            })
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await ArticleModel.countDocuments({ isActive: isActive })

        res.status(200).json({
            data: articles,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        })
    }
    catch (err: any) {
        if (err.message) {
            console.error(err.message)
            res.status(500).json({ message: err.message })
        }
        else {
            res.status(500).json({ message: "Internal Sever Error" })
        }
    }
}

export const getArticleById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid Article ID" })
        }

        const article = await ArticleModel.findById(id).populate("author", "name email")
        if (!article) {
            return res.status(404).json({ error: "Article Not Found" })
        }

        res.status(200).json(article)

    }
    catch (err: any) {
        if (err.message) {
            console.log(err.message)
            res.status(500).json({ message: err.message })
        }
        else {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}

export const getMyArticles = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.sub
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        const articles = await ArticleModel.find({ author: userId, isActive: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        res.status(200).json(articles)
    }
    catch (err: any) {
        if (err.message) {
            console.log(err)
            res.status(500).json({ message: err.message })
        }
        else {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}

export const changeActive = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid Article ID" })
        }

        const article = await ArticleModel.findById(id)
        if (!article) {
            return res.status(404).json({ error: "Article not found" })
        }

        article.isActive = !article.isActive
        await article.save()

        res.status(200).json(article)
    }
    catch (err: any) {
        if (err.message) {
            console.log(err)
            res.status(500).json({ message: err.message })
        }
        else {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}

export const toggleLike = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params
        const userId = req.user?.sub
        if (!userId || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid Request" })
        }

        const article = await ArticleModel.findById(id)
        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        let isLiked = false
        const index = article.likes.indexOf(userId as any)

        if (index === -1) {
            article.likes.push(userId as any)
            isLiked = true
        }
        else {
            article.likes.splice(index, 1)
        }

        await article.save()
        res.status(200).json({ likes: article.likes, isLiked: isLiked })
    }
    catch (err: any) {
        console.log(err)
        res.status(500).json({ message: err.message ? err.message : "Internal server error" })
    }
}

export const getArticleCount = async (req: Request, res: Response) => {
    try {
        const count = await ArticleModel.countDocuments({})
        res.status(200).json(count)
    }
    catch (err: any) {
        console.log(err)
        res.status(500).json({ message: err.message ? err.message : "Internal server error" })
    }
}

export const getMostLikedArticles = async (req: Request, res: Response) => {
    try {
        const mostLiked = await ArticleModel.aggregate([
            { $match: { isActive: true } },
            { $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
            { $sort: { likesCount: -1 } },
            { $limit: 5 },
        ]);

        res.status(200).json(mostLiked)
    }
    catch (err: any) {
        console.log(err)
        res.status(500).json({ message: err.message ? err.message : "Internal server error" })
    }
}

export const getAllAdminArticles = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        const s = (req.query.search as string || "").trim()
        const fixed = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(fixed, "i")

        const articles = await ArticleModel.find({
            $or: [{ title: regex }, { gameNames: regex }, { tag: regex }]
        })
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await ArticleModel.countDocuments({})

        res.status(200).json({
            data: articles,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        })
    }
    catch (err: any) {
        if (err.message) {
            console.error(err.message)
            res.status(500).json({ message: err.message })
        }
        else {
            res.status(500).json({ message: "Internal Sever Error" })
        }
    }
}

export const getArticlesPerTag = async (req: Request, res: Response) => {
    try {
        const articlesPerTag = await ArticleModel.aggregate([
            { $match: { isActive: true } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 7 },
            { $project: { _id: 0, tag: "$_id", count: 1 } },
        ]);

        res.status(200).json(articlesPerTag)
    }
    catch (err: any) {
        if (err.message) {
            console.error(err.message)
            res.status(500).json({ message: err.message })
        }
        else {
            res.status(500).json({ message: "Internal Sever Error" })
        }
    }
}