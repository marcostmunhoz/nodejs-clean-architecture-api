import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const BCRYPT_SALT = 12
const ENCRYPTED_VALUE = 'encrypted_string'

jest.mock('bcrypt', () => ({
  async hash (data: string, saltOrRounds: number): Promise<string> {
    return ENCRYPTED_VALUE
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

  test('Should return encrypted string on success', async () => {
    // given
    const sut = makeSut()
    const value = 'some_string'

    // when
    const encrypted = await sut.encrypt(value)

    // then
    expect(encrypted).toEqual(ENCRYPTED_VALUE)
  })

  test('Should throws if bcrypt throws', async () => {
    // given
    const sut = makeSut()
    const value = 'some_string'
    jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    // when
    const promise = sut.encrypt(value)

    // then
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow()
  })
})
