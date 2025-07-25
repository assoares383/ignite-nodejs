import { Uploader, UploadParams } from "@/domain/forum/application/storage/uploader";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnvService } from "../env/env.service";

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      }
    })
  }

  async upload({
    fileName,
    fileType,
    body
  }: UploadParams): Promise<{ url: string }> {
    const uploadID = randomUUID()
    const uniqueFileName = `${uploadID}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        Body: body,
        ContentType: fileType,
      })
    )

    return {
      url: uniqueFileName
    }
  }
}
