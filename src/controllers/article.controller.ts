import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { UserModel } from "../models/user.model";
import { ArticleModel } from "../models/article.model";

export const createArticle = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, gameNames, tags } = req.body
        if (!title || !content) { return res.status(404).json({ message: "Article must have Title and Content" }) }

        const userId = req.user?.sub
        if (!userId) { return res.status(401).json({ message: "Unauthorized" }) }

        const user = await UserModel.findById(userId).select("-password")
        if (!user) { return res.status(404).json({ message: "User not found" }) }

        const coverImageUrl = ""

        const article = ArticleModel.create({
            title,
            content,
            gameNames: gameNames ? JSON.parse(gameNames) : [],
            tags: tags ? JSON.parse(tags) : [],
            coverImageUrl,
            author: user._id,
        })

        res.status(201).json(article)
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}