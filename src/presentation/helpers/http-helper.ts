import { ServerError } from '../errors'
import { HttpResponse } from '../protocols/http'

export const success = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unprocessableEntity = (error: Error): HttpResponse => ({
  statusCode: 422,
  body: error
})

export const serverError = (error?: Error): HttpResponse => ({
  statusCode: 500,
  body: error ?? new ServerError()
})
