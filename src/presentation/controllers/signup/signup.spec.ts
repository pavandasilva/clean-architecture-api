import SignUpController from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccountModel, AddAccount, AccountModel } from './signupProtocols'

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
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: '1',
        name: 'myname',
        email: 'email@email.com',
        password: '1234'
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

describe('SignUp Controller', () => {
  test('deve retornar erro 400 quando o name não for informado', async () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('deve retornar erro 400 quando o email não for informado', async () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'myname',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('deve retornar erro 400 quando a password não for informada', async () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'myname',
        email: 'email@email.com',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('deve retornar erro 400 quando a passwordConfirmation não for informada', async () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'myname',
        email: 'email@email.com',
        password: '1234'
      }
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    )
  })

  test('deve retornar erro 400 se o email for inválido', async () => {
    const { signUpController, emailValidatorStub } = makeSignUpController()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)

    const httpRequest = {
      body: {
        name: 'myname',
        email: 'myemail',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('deve passar o email correto para a função de validar email', async () => {
    const { signUpController, emailValidatorStub } = makeSignUpController()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'myname',
        email: 'email@email.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    await signUpController.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('email@email.com')
  })

  test('deve retornar erro 500 se o email validador tiver excessão', async () => {
    const { signUpController, emailValidatorStub } = makeSignUpController()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'myname',
        email: 'myemail',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('error'))
  })

  test('deve retornar erro 400 se a confirmação de password for inválida', async () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'myname',
        email: 'email@email.com',
        password: '1234',
        passwordConfirmation: 'invalid'
      }
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    )
  })
  test('deve chamar AddAccount com valores corretos', async () => {
    const { signUpController, addAccountStub } = makeSignUpController()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'myname',
        email: 'email@email.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    await signUpController.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'myname',
      email: 'email@email.com',
      password: '1234'
    })
  })

  test('deve retornar erro 500 se o addAccount tiver excessão', async () => {
    const { signUpController, addAccountStub } = makeSignUpController()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'myname',
        email: 'myemail',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('error'))
  })

  test('deve retornar 200 se os dados passados são válidos', async () => {
    const { signUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'myname',
        email: 'email@email.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)

    expect(httpResponse.body).toEqual({
      id: '1',
      name: 'myname',
      email: 'email@email.com',
      password: '1234'
    })
  })
})
