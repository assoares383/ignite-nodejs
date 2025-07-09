import { compare, hash } from 'bcryptjs';

import { HasherCompare } from "@/domain/forum/application/cryptography/hasher-compare";
import { HasherGenerator } from "@/domain/forum/application/cryptography/hasher-generator";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BcryptHasher implements HasherGenerator, HasherCompare {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }

}
