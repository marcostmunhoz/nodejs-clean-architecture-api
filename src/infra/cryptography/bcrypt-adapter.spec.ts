import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const BCRYPT_SALT = 12

jest.mock('bcrypt', () => ({
  async hash (data: string, saltOrRounds: number): Promise<string> {
    return 'encrypted_string'
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(BCRYPT_SALT)
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct value', async () => {
    // given
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const value = 'some_string'

    // when
    await sut.encrypt(value)

    // then
    expect(hashSpy).toHaveBeenCalledWith(value, BCRYPT_SALT)
  })
})
