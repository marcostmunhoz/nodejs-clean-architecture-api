import { EmailValidatorAdapter } from '@utils/email-validator'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    // given
    const sut = makeSut()

    // when
    const isValid = sut.isValid('invalid_email@mail.com')

    // then
    expect(isValid).toBe(false)
  })
})
