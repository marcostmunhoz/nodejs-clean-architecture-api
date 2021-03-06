import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { serverError, unprocessableEntity, created } from '@/presentation/helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
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

      const { name } = request.body
      const model = await this.addAccount.execute({ name, email, password })

      return created(model)
    } catch (error) {
      return serverError()
    }
  }
}
