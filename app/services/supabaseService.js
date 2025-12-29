import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: { persistSession: false },
    }
);

function sanitizeFileName(name = "file") {
    return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-_.]/g, "")
        .replace(/-+/g, "-");
}

export async function uploadImageToSupabase({
    file,
    folder = "images",
    fileBaseName,
}) {
    if (!(file instanceof File) || file.size === 0) {
        throw new Error("Invalid file");
    }

    const bucket = process.env.SUPABASE_BUCKET || "uploads";
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";

    const safeBase = sanitizeFileName(fileBaseName || "upload");
    const path = `${folder}/${safeBase}-${Date.now()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // upload (upsert true to replace if same path)
    const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: true,
        });

    if (error) throw error;

    // إذا bucket public
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    return { path, publicUrl: data.publicUrl };
}
