import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
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

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async create (addAccountModel: AddAccountModel): Promise<AccountModel> {
      const { name, email, password } = addAccountModel

      return {
        id: 'some_id',
        name,
        email,
        password
      }
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()

  return {
    sut: new DbAddAccount(encrypterStub, addAccountRepositoryStub),
    encrypterStub,
    addAccountRepositoryStub
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

  test('Should call AddAccountRepository with correct values', async () => {
    // given
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountModel = {
      name: 'valid name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const createSpy = jest.spyOn(addAccountRepositoryStub, 'create')

    // when
    await sut.execute(addAccountModel)

    // then
    const { name, email } = addAccountModel
    expect(createSpy).toHaveBeenCalledWith({
      name,
      email,
      password: 'encrypted_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    // given
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountModel = {
      name: 'valid name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    jest.spyOn(addAccountRepositoryStub, 'create')
      .mockReturnValueOnce(Promise.reject(new Error()))

    // when
    const promise = sut.execute(addAccountModel)

    // then
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow()
  })

  test('Should return an AccountModel on success', async () => {
    // given
    const { sut } = makeSut()
    const addAccountModel = {
      name: 'valid name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    // when
    const model = await sut.execute(addAccountModel)

    // then
    const { name, email } = addAccountModel
    expect(model).toStrictEqual({
      id: 'some_id',
      name,
      email,
      password: 'encrypted_password'
    })
  })
})
