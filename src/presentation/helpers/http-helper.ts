import { ServerError } from '../errors'
import { HttpResponse } from '../protocols/http'

export const created = (body: any): HttpResponse => ({
  statusCode: 201,
  body
})

export const unprocessableEntity = (error: Error): HttpResponse => ({
  statusCode: 422,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
