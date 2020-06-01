import SignUpController from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'
import { AddAccountModel, AddAccount } from '../../domain/usecases/addAccount'
import { AccountModel } from '../../domain/models/account'

const makeSignUpController = (): any => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const signUpController = new SignUpController(
    emailValidatorStub,
    addAccountStub
  )

  return {
    signUpController,
    emailValidatorStub,
    addAccountStub
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: '1',
        nome: 'meu nome',
        email: 'email@email.com',
        senha: '1234'
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

describe('SignUp Controller', () => {
  test('deve retornar erro 400 quando o nome não for informado', () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        email: 'email@email.com',
        senha: '1234',
        confirmacaoSenha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('nome'))
  })

  test('deve retornar erro 400 quando o email não for informado', () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        senha: '1234',
        confirmacaoSenha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('deve retornar erro 400 quando a senha não for informada', () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        confirmacaoSenha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('senha'))
  })

  test('deve retornar erro 400 quando a confirmacaoSenha não for informada', () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        senha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('confirmacaoSenha')
    )
  })

  test('deve retornar erro 400 se o email for inválido', () => {
    const { signUpController, emailValidatorStub } = makeSignUpController()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'Meu email',
        senha: '1234',
        confirmacaoSenha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('deve chamar a função de validar email com o email correto', () => {
    const { signUpController, emailValidatorStub } = makeSignUpController()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        senha: '1234',
        confirmacaoSenha: '1234'
      }
    }

    signUpController.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('email@email.com')
  })

  test('deve retornar erro 500 se o email validador tiver excessão', () => {
    const { signUpController, emailValidatorStub } = makeSignUpController()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'Meu email',
        senha: '1234',
        confirmacaoSenha: '1234'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('deve retornar erro 400 se a confirmação de senha for inválida', () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        senha: '1234',
        confirmacaoSenha: 'invalido'
      }
    }

    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('confirmacaoSenha')
    )
  })
  test('deve chamar AddAccount com valores corretos', () => {
    const { signUpController, addAccountStub } = makeSignUpController()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        nome: 'Nome de teste',
        email: 'email@email.com',
        senha: '1234',
        confirmacaoSenha: '1234'
      }
    }

    signUpController.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      nome: 'Nome de teste',
      email: 'email@email.com',
      senha: '1234'
    })
  })
})
