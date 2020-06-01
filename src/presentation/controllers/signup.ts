import { HttpResponse, HttpRequest } from '../protocols/http'
import MissingParamError from '../errors/missingParamError'

class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.nome) {
      return {
        statusCode: 400,
        body: new MissingParamError('nome')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
  }
}

export default SignUpController
