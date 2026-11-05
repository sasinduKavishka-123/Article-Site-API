import { Date, Document, model, Schema, Types } from "mongoose";

export interface IComment extends Document {
    author: Types.ObjectId
    article: Types.ObjectId
    text: string
    isActive: boolean
    createdAt: Date
    updatedAT: Date
}

const commentSchema = new Schema<IComment>(
    {
        author: { type: Schema.Types.ObjectId, ref: "system_users" },
        article: { type: Schema.Types.ObjectId, ref: "articles" },
        text: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export const commentModel = model<IComment>("comments", commentSchema)