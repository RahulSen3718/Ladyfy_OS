export interface UploadFileOptions {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  folderPath?: string;
}

export interface UploadFileResult {
  url: string;
  provider: "GOOGLE_DRIVE" | "SUPABASE_STORAGE" | "S3" | "OTHER";
  fileSize: number;
  mimeType: string;
  storageKey: string;
}

export interface IStorageService {
  uploadFile(options: UploadFileOptions): Promise<UploadFileResult>;
  deleteFile(storageKey: string): Promise<boolean>;
  getDownloadUrl(storageKey: string): Promise<string>;
}
