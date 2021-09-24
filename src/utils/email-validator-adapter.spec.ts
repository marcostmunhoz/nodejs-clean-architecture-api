import { EmailValidatorAdapter } from '@utils/email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    // given
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    // when
    const isValid = sut.isValid('invalid_email@mail.com')

    // then
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    // given
    const sut = makeSut()

    // when
    const isValid = sut.isValid('valid_email@mail.com')

    // then
    expect(isValid).toBe(true)
  })
})
