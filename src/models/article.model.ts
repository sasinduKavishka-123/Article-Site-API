import { Date, Document, model, Schema, Types } from "mongoose"

export interface IArticle extends Document {
    title: string
    content: string
    gameNames: string[]
    tags: string[]
    coverImageUrl: string
    author: Types.ObjectId
    likes: Types.ObjectId[]
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const articleSchema = new Schema<IArticle>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        gameNames: { type: [String], default: [] },
        tags: { type: [String], default: [] },
        coverImageUrl: { type: String, default: "" },
        author: { type: Schema.Types.ObjectId, ref: "system_users" },
        likes: { type: [Schema.Types.ObjectId], ref: "system_users" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export const ArticleModel = model<IArticle>("articles", articleSchema)