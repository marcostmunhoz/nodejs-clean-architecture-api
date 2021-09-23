import { InvalidParamError, MissingParamError } from '../errors'
import { success, serverError, unprocessableEntity } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpResponse, HttpRequest } from '../protocols'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (request: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!request.body[field]) {
          return unprocessableEntity(new MissingParamError(field))
        }
      }

      const { email, password, passwordConfirmation } = request.body
      const passwordConfirmationMatches = password === passwordConfirmation
      if (!passwordConfirmationMatches) {
        return unprocessableEntity(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return unprocessableEntity(new InvalidParamError('email'))
      }

      return success({})
    } catch (error) {
      return serverError()
    }
  }
}
