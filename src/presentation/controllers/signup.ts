import { HttpResponse, HttpRequest } from '../protocols/http'

class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.nome) {
      return {
        statusCode: 400,
        body: new Error('Faltando o parâmetro nome')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Faltando o parâmetro email')
      }
    }
  }
}

export default SignUpController
