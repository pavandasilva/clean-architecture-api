import SignUpController from './signup'
import MissingParamError from '../errors/missingParamError'
import InvalidParamError from '../errors/invalidParamError'
import { EmailValidator } from '../protocols/emailValidator'

const makeSignUpController = (emailIsValid: boolean): SignUpController => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return emailIsValid
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  return new SignUpController(emailValidatorStub)
}

describe('SignUp Controller', () => {
  test('deve retornar erro 400 quando o nome não for informado', () => {
    const signupController = makeSignUpController(true)

    const httpRequest = {
      body: {
        email: 'email@email.com',
        senha: '1234',
        confirmacao_senha: '1234'
      }
    }

    const httpResponse = signupController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('nome'))
  })

  test('deve retornar erro 400 quando o email não for informado', () => {
    const signupController = makeSignUpController(true)

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        senha: '1234',
        confirmacao_senha: '1234'
      }
    }

    const httpResponse = signupController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('deve retornar erro 400 quando a senha não for informada', () => {
    const signupController = makeSignUpController(true)

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        confirmacao_senha: '1234'
      }
    }

    const httpResponse = signupController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('senha'))
  })

  test('deve retornar erro 400 quando a confirmacao_senha não for informada', () => {
    const signupController = makeSignUpController(true)

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        senha: '1234'
      }
    }

    const httpResponse = signupController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('confirmacao_senha'))
  })

  test('deve retornar erro 400 se o email for inválido', () => {
    const signupController = makeSignUpController(false)

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'Meu email',
        senha: '1234',
        confirmacao_senha: '1234'
      }
    }

    const httpResponse = signupController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})
