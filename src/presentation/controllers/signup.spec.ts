import SignUpController from './signup'

describe('SignUp Controller', () => {
  test('deve retornar erro 400 quando o nome não for informado', () => {
    const signupController = new SignUpController()

    const httpRequest = {
      email: 'email@email.com',
      senha: '1234',
      confirmacao_senha: '1234'
    }

    const httpResponse = signupController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Faltando o parâmetro nome'))
  })
})
