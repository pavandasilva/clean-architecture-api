import SignUpController from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'

const makeSignUpController = (emailIsValid: boolean): any => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return emailIsValid
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const signUpController = new SignUpController(emailValidatorStub)

  return {
    signUpController,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('deve retornar erro 400 quando o nome não for informado', () => {
    const { signUpController } = makeSignUpController(true)

    const httpRequest = {
      body: {
        email: 'email@email.com',
        senha: '1234',
        confirmacao_senha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('nome'))
  })

  test('deve retornar erro 400 quando o email não for informado', () => {
    const { signUpController } = makeSignUpController(true)

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        senha: '1234',
        confirmacao_senha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('deve retornar erro 400 quando a senha não for informada', () => {
    const { signUpController } = makeSignUpController(true)

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        confirmacao_senha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('senha'))
  })

  test('deve retornar erro 400 quando a confirmacao_senha não for informada', () => {
    const { signUpController } = makeSignUpController(true)

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        senha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('confirmacao_senha'))
  })

  test('deve retornar erro 400 se o email for inválido', () => {
    const { signUpController } = makeSignUpController(false)

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'Meu email',
        senha: '1234',
        confirmacao_senha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('deve chamar a função de validar email com o email correto', () => {
    const { signUpController, emailValidatorStub } = makeSignUpController(true)

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        senha: '1234',
        confirmacao_senha: '1234'
      }
    }

    signUpController.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('email@email.com')
  })

  test('deve retornar erro 500 se o email validador tiver excessão', () => {
    const { signUpController, emailValidatorStub } = makeSignUpController(true)

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'Meu email',
        senha: '1234',
        confirmacao_senha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('deve retornar erro 400 se a confirmação de senha for inválida', () => {
    const { signUpController } = makeSignUpController(true)

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        senha: '1234',
        confirmacao_senha: 'invalido'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('confirmacao_senha'))
  })
})
