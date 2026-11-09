import { supabase } from "../config/supabase"

export const uploadImage = async (
    userName: string,
    file: Express.Multer.File,
    bucketName: string = "article_images"
): Promise<string> => {
    const uuid = crypto.randomUUID()
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "-")
    const fileName = `${userName}-${uuid}-${sanitizedName}`

    const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file.buffer, { contentType: file.mimetype })

    if (error) {
        throw new Error(`Image upload failed: ${error.message}`)
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)
    return data.publicUrl
}