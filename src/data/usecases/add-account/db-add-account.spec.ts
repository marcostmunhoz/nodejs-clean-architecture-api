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
  test('Should call encrypter with provided password', async () => {
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
})
