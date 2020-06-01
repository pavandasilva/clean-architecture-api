import { HttpResponse, HttpRequest } from '../protocols/http'
import MissingParamError from '../errors/missingParamError'
import { badRequest } from '../helpers/httpHelper'

class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['nome', 'email', 'senha', 'confirmacao_senha']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}

export default SignUpController
