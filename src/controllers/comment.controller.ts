import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { UserModel } from "../models/user.model";
import { commentModel } from "../models/comment.model";
import { ArticleModel } from "../models/article.model";


export const createComment = async (req: AuthRequest, res: Response) => {
    try {
        const { text, articleId } = req.body

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({ message: "Text is required." });
        }

        if (typeof articleId !== "string" || !articleId.trim()) {
            return res.status(400).json({ message: "Article ID is required." });
        }

        const userId = req.user?.sub
        if (!userId) { return res.status(401).json({ message: "Unauthorized" }) }

        const user = await UserModel.findById(userId).select("-password")
        if (!user) { return res.status(404).json({ message: "User not found" }) }

        const article = await ArticleModel.findById(articleId)
        if (!article) { return res.status(404).json({ message: "Article not found" }) }

        const comment = await commentModel.create({
            text,
            author: user._id,
            article: article._id
        })
        res.status(201).json(comment)
    }
    catch (err: any) {
        console.log(err)
        res.status(500).json({ message: err.message ? err.message : "Internal server error" })
    }
}