import { Encrypter } from '@/data/protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  encrypterStub: Encrypter
  sut: DbAddAccount
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'encrypted_password'
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypter = makeEncrypter()

  return {
    sut: new DbAddAccount(encrypter),
    encrypterStub: encrypter
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with provided password', async () => {
    // given
    const { sut, encrypterStub } = makeSut()
    const addAccountModel = {
      name: 'valid name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    // when
    await sut.execute(addAccountModel)

    // then
    expect(encryptSpy).toHaveBeenCalledWith(addAccountModel.password)
  })

  test('Should throw if Encrypter throws', async () => {
    // given
    const { sut, encrypterStub } = makeSut()
    const addAccountModel = {
      name: 'valid name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(Promise.reject(new Error()))

    // when
    const promise = sut.execute(addAccountModel)

    // then
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow()
  })
})
