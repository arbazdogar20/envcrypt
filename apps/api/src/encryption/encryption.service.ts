import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly keyLength = 32
  private readonly ivLength = 16
  private readonly tagLength = 16

  private getKey(): Buffer {
    const masterKey = process.env.MASTER_ENCRYPTION_KEY
    if (!masterKey) throw new Error('MASTER_ENCRYPTION_KEY is not set')
    return crypto.scryptSync(masterKey, 'envcrypt-salt', this.keyLength)
  }

  encrypt(plaintext: string): string {
    const key = this.getKey()
    const iv = crypto.randomBytes(this.ivLength)
    const cipher = crypto.createCipheriv(this.algorithm, key, iv)
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ])
    const tag = cipher.getAuthTag()
    return Buffer.concat([iv, tag, encrypted]).toString('base64')
  }

  decrypt(ciphertext: string): string {
    const key = this.getKey()
    const data = Buffer.from(ciphertext, 'base64')
    const iv = data.subarray(0, this.ivLength)
    const tag = data.subarray(this.ivLength, this.ivLength + this.tagLength)
    const encrypted = data.subarray(this.ivLength + this.tagLength)
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf8')
  }
}