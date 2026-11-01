import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { UserModel } from "../models/user.model";
import { ArticleModel } from "../models/article.model";

const cleanList = (value: string[], { lowercase = false } = {}) => {
    if (!Array.isArray(value)) return []
    const seen = new Set()
    const result = []

    for (const item of value) {
        if (typeof item !== "string") continue
        let v = item.trim().replace(/\s+/g, " ")

        if (lowercase) v = v.toLowerCase()
        if (!v || seen.has(v.toLowerCase())) continue
        seen.add(v.toLowerCase())
        result.push(v)
    }

    return result
};

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

        const coverImageUrl = ""

        const article = await ArticleModel.create({
            title,
            content,
            gameNames: cleanList(gameNames),
            tags: cleanList(tags, { lowercase: true }),
            coverImageUrl,
            author: user._id,
        })

        res.status(201).json(article)
    }
    catch (err: any) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}