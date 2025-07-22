import { Attachment } from '../../enterprise/entities/attachments';

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>
}
