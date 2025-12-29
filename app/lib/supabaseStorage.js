import { supabaseAdmin } from "./supabaseAdmin";

function sanitizeBase(name = "file") {
    return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-_.]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export async function uploadFileToSupabase({
    file,
    folder,
    fileBaseName,
    contentTypeFallback,
    upsert = true,
}) {
    if (!(file instanceof File) || file.size === 0) {
        throw new Error("Invalid file");
    }

    const bucket = process.env.SUPABASE_BUCKET || "uploads";
    const ext = file.name?.includes(".") ? file.name.split(".").pop() : "bin";
    const safeBase = sanitizeBase(fileBaseName || "upload");
    const storagePath = `${folder}/${safeBase}-${Date.now()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(storagePath, buffer, {
            contentType:
                file.type || contentTypeFallback || "application/octet-stream",
            upsert,
        });
    if (error) throw error;

    const { data } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(storagePath);
    return { storagePath, publicUrl: data.publicUrl };
}

export async function removeFromSupabase(paths = []) {
    const bucket = process.env.SUPABASE_BUCKET || "uploads";
    const clean = paths.filter(Boolean);
    if (clean.length === 0) return;

    const { error } = await supabaseAdmin.storage.from(bucket).remove(clean);
    if (error) {
        console.warn("Supabase remove failed:", error);
    }
}
