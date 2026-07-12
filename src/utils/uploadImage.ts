import { logError } from "./logError";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file: File, folder: string, publicId?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder || "volunteers");

  // fixed public_id → Cloudinary overwrites the existing image
  if (publicId) {
    formData.append("public_id", publicId);
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok){
    await logError({type: "uploadImage" , error: res.statusText}).catch(console.error);
    throw new Error("Image upload failed");
  } 
  const data = await res.json();
  return data.secure_url as string;
}
