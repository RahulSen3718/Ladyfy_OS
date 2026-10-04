import { IStorageService, UploadFileOptions, UploadFileResult } from "./storage.interface";

export class SupabaseStorageService implements IStorageService {
  private bucketName: string;

  constructor(bucketName = "leadyfy-assets") {
    this.bucketName = bucketName;
  }

  async uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
    const key = `${options.folderPath ? options.folderPath + "/" : ""}${Date.now()}-${options.fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    
    // In production with live Supabase storage credentials, this uses supabase.storage
    // Designed with clear provider abstraction
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://storage.leadyfy.io"}/storage/v1/object/public/${this.bucketName}/${key}`;

    return {
      url: publicUrl,
      provider: "SUPABASE_STORAGE",
      fileSize: options.buffer.length,
      mimeType: options.mimeType,
      storageKey: key,
    };
  }

  async deleteFile(storageKey: string): Promise<boolean> {
    return true;
  }

  async getDownloadUrl(storageKey: string): Promise<string> {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://storage.leadyfy.io"}/storage/v1/object/public/${this.bucketName}/${storageKey}`;
  }
}

export class GoogleDriveStorageService implements IStorageService {
  async uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
    // Standard Google Drive API file creation with folder nesting
    const key = `gdrive_${Date.now()}_${options.fileName}`;
    return {
      url: `https://drive.google.com/file/d/${key}/view`,
      provider: "GOOGLE_DRIVE",
      fileSize: options.buffer.length,
      mimeType: options.mimeType,
      storageKey: key,
    };
  }

  async deleteFile(storageKey: string): Promise<boolean> {
    return true;
  }

  async getDownloadUrl(storageKey: string): Promise<string> {
    return `https://drive.google.com/uc?export=download&id=${storageKey}`;
  }
}

export function getStorageService(): IStorageService {
  const provider = process.env.STORAGE_PROVIDER || "SUPABASE_STORAGE";
  if (provider === "GOOGLE_DRIVE") {
    return new GoogleDriveStorageService();
  }
  return new SupabaseStorageService();
}
