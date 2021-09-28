import { Encrypter } from '@/data/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {}

  async encrypt (value: string): Promise<string> {
    const hashed = await bcrypt.hash(value, this.salt)

    return hashed
  }
}
