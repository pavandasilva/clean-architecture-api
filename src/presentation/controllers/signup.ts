class SignUpController {
  handle (httpRequest: any): any {
    return {
      statusCode: 400,
      body: new Error('Faltando o parâmetro nome')
    }
  }
}

export default SignUpController
