import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '@presentation/errors'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async execute (addModel: AddAccountModel): Promise<AccountModel> {
      return {
        id: 'some_id',
        ...addModel
      }
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 422 if no name is provided', async () => {
    // given
    const { sut } = makeSut()
    const request = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    // when
    const response = await sut.handle(request)

    // then
    expect(response.statusCode).toBe(422)
    expect(response.body).toStrictEqual(new MissingParamError('name'))
  })

  test('Should return 422 if no email is provided', async () => {
    // given
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'any name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    // when
    const response = await sut.handle(request)

    // then
    expect(response.statusCode).toBe(422)
    expect(response.body).toStrictEqual(new MissingParamError('email'))
  })

  test('Should return 422 if no password is provided', async () => {
    // given
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }

    // when
    const response = await sut.handle(request)

    // then
    expect(response.statusCode).toBe(422)
    expect(response.body).toStrictEqual(new MissingParamError('password'))
  })

  test('Should return 422 if no password confirmation is provided', async () => {
    // given
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    // when
    const response = await sut.handle(request)

    // then
    expect(response.statusCode).toBe(422)
    expect(response.body).toStrictEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 422 if password confirmation fails', async () => {
    // given
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    // when
    const response = await sut.handle(request)

    // then
    expect(response.statusCode).toBe(422)
    expect(response.body).toStrictEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 422 if an invalid email is provided', async () => {
    // given
    const { sut, emailValidatorStub } = makeSut()
    const request = {
      body: {
        name: 'any name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    // when
    const response = await sut.handle(request)

    // then
    expect(response.statusCode).toBe(422)
    expect(response.body).toStrictEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', async () => {
    // given
    const { sut, emailValidatorStub } = makeSut()
    const request = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    // when
    await sut.handle(request)

    // then
    expect(isValidSpy).toHaveBeenCalledWith(request.body.email)
  })

  test('Should return 500 if EmailValidator throws', async () => {
    // given
    const { sut, emailValidatorStub } = makeSut()
    const request = {
      body: {
        name: 'any name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })

    // when
    const response = await sut.handle(request)

    // then
    expect(response.statusCode).toBe(500)
    expect(response.body).toStrictEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', async () => {
    // given
    const { sut, addAccountStub } = makeSut()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const executeSpy = jest.spyOn(addAccountStub, 'execute')

    // when
    await sut.handle(request)

    // then
    const { name, email, password } = request.body
    expect(executeSpy).toHaveBeenCalledWith({ name, email, password })
  })

  test('Should return 500 if AddAccount throws', async () => {
    // given
    const { sut, addAccountStub } = makeSut()
    const request = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    jest.spyOn(addAccountStub, 'execute').mockImplementation(async () => {
      throw new Error()
    })

    // when
    const response = await sut.handle(request)

    // then
    expect(response.statusCode).toBe(500)
    expect(response.body).toStrictEqual(new ServerError())
  })

  test('Should return 200 if valid data is provided', async () => {
    // given
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    // when
    const response = await sut.handle(request)

    // then
    const { name, email, password } = request.body
    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual({
      id: 'some_id',
      name,
      email,
      password
    })
  })
})
