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

  test('Deve chamar o validator com o email correto', () => {
    const email = 'email@email.com'
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    emailValidatorAdapter.isValid(email)
    expect(isEmailSpy).toHaveBeenCalledWith(email)
  })
})
