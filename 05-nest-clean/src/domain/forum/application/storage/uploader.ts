export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(upload: UploadParams): Promise<{ url: string }>
}
