import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
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
    const response = sut.handle(request)

    // then
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
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
    const response = sut.handle(request)

    // then
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
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
    const response = sut.handle(request)

    // then
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
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
    const response = sut.handle(request)

    // then
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
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
    const response = sut.handle(request)

    // then
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
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
    sut.handle(request)

    // then
    expect(isValidSpy).toHaveBeenCalledWith(request.body.email)
  })

  test('Should return 500 if EmailValidator throws', () => {
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
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    isValidSpy.mockImplementation((email: string): boolean => {
      throw new Error()
    })

    // when
    const response = sut.handle(request)

    // then
    expect(response.statusCode).toBe(500)
    expect(response.body).toStrictEqual(new ServerError())
  })
})
