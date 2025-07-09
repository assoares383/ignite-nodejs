import { Module } from "@nestjs/common";

import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { HasherCompare } from "@/domain/forum/application/cryptography/hasher-compare";
import { HasherGenerator } from "@/domain/forum/application/cryptography/hasher-generator";

import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HasherCompare, useClass: BcryptHasher },
    { provide: HasherGenerator, useClass: BcryptHasher }
  ],
  exports: [Encrypter, HasherCompare, HasherGenerator]
})
export class CryptographyModule {
}
