import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    // given
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
})
