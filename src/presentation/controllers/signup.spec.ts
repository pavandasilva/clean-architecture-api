import SignUpController from './signup'
import MissingParamError from '../errors/missingParamError'

describe('SignUp Controller', () => {
  test('deve retornar erro 400 quando o nome não for informado', () => {
    const signupController = new SignUpController()

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
    const signupController = new SignUpController()

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
})
