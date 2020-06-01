import SignUpController from './signup'

describe('SignUp Controller', () => {
  test('deve retornar erro 400 quando o nome não for informado', () => {
    const signupController = new SignUpController()

    const httpRequest = {
      email: 'email@email.com',
      password: '1234',
      passwordConfirmation: '1234'
    }

    const httpResponse = signupController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
