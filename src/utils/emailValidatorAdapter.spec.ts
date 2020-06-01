import { EmailValidatorAdapter } from './emailValidatorAdapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('Deve retornar false se o validator retornar false', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = emailValidatorAdapter.isValid('invalid_email@email.com')

    expect(isValid).toBe(false)
  })

  test('Deve retornar true se o validator retornar true', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const isValid = emailValidatorAdapter.isValid('valid_email@test.com')

    expect(isValid).toBe(true)
  })
})
