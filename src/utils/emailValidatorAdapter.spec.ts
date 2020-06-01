import { EmailValidatorAdapter } from './emailValidatorAdapter'

describe('EmailValidator Adapter', () => {
  test('Deve retornar false se o validator retornar false', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const isValid = emailValidatorAdapter.isValid('invalid_email')

    expect(isValid).toBe(false)
  })
})
