import { supabase } from "../config/supabase"

const BUCKET = "article_images"
const PUBLIC_PREFIX = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`

export const deleteImageByUrl = async (oldUrl: string, ownerId: string) => {

    const path = oldUrl && oldUrl.startsWith(PUBLIC_PREFIX)
        ? decodeURIComponent(oldUrl.slice(PUBLIC_PREFIX.length).split("?")[0])
        : null
        
    if (!path || !path.startsWith(`${ownerId}`)) { return }
    
    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) {
        console.log("Could not delete old image:", path, error.message)
    }
}

export const cleanList = (value: string[], { lowercase = false } = {}) => {
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
}